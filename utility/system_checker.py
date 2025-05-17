import platform
import psutil
import os
import time
import json
import requests
import subprocess
from datetime import datetime
import logging
from typing import Dict, Any
from config import Config

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('system_checker.log'),
        logging.StreamHandler()
    ]
)

class SystemChecker:
    def __init__(self):
        self.config = Config()
        self.api_url = self.config.api_url
        self.api_key = self.config.api_key
        self.check_interval = self.config.check_interval
        self.machine_id = self._get_machine_id()
        self.last_check = None
        self.last_data = None
        self.resource_usage = {
            'cpu_percent': 0,
            'memory_percent': 0,
            'disk_usage_percent': 0
        }
        logging.info(f"Initialized SystemChecker with API URL: {self.api_url}")

    def _get_machine_id(self) -> str:
        """Generate a unique machine ID based on system information."""
        system_info = platform.uname()
        return f"{system_info.system}-{system_info.node}-{system_info.machine}"

    def _check_command_exists(self, command: str) -> bool:
        """Check if a command exists in the system."""
        try:
            if platform.system() == "Windows":
                subprocess.run(['where', command], capture_output=True, check=True)
            else:
                subprocess.run(['which', command], capture_output=True, check=True)
            return True
        except subprocess.CalledProcessError:
            return False

    def _update_resource_usage(self):
        """Update resource usage statistics."""
        try:
            # Get CPU usage with a small interval to avoid blocking
            cpu_percent = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            self.resource_usage = {
                'cpu_percent': cpu_percent,
                'memory_percent': memory.percent,
                'disk_usage_percent': disk.percent
            }
        except Exception as e:
            logging.error(f"Error updating resource usage: {str(e)}")
            # Set default values on error
            self.resource_usage = {
                'cpu_percent': 0,
                'memory_percent': 0,
                'disk_usage_percent': 0
            }

    def check_disk_encryption(self) -> Dict[str, Any]:
        """Check disk encryption status."""
        try:
            if platform.system() == "Windows":
                if not self._check_command_exists('manage-bde'):
                    return {"status": "unknown", "details": "BitLocker command not found"}
                result = subprocess.run(['manage-bde', '-status'], capture_output=True, text=True)
                is_encrypted = "Conversion Status:    Fully Encrypted" in result.stdout
            elif platform.system() == "Darwin":  # macOS
                if not self._check_command_exists('fdesetup'):
                    return {"status": "unknown", "details": "FileVault command not found"}
                result = subprocess.run(['fdesetup', 'status'], capture_output=True, text=True)
                is_encrypted = "FileVault is On" in result.stdout
            else:  # Linux
                if not self._check_command_exists('cryptsetup'):
                    return {"status": "unknown", "details": "LUKS command not found"}
                result = subprocess.run(['cryptsetup', 'status'], capture_output=True, text=True)
                is_encrypted = "LUKS" in result.stdout

            return {
                "status": "encrypted" if is_encrypted else "unencrypted",
                "details": result.stdout if result.stdout else "Unknown"
            }
        except Exception as e:
            logging.error(f"Error checking disk encryption: {str(e)}")
            return {"status": "unknown", "details": str(e)}

    def check_os_updates(self) -> Dict[str, Any]:
        """Check OS update status."""
        try:
            if platform.system() == "Windows":
                if not self._check_command_exists('wmic'):
                    return {"status": "unknown", "details": "WMIC command not found"}
                result = subprocess.run(['wmic', 'qfe', 'list', 'brief'], capture_output=True, text=True)
                updates = result.stdout.split('\n')[1:]  # Skip header
                latest_update = updates[0] if updates else "No updates found"
            elif platform.system() == "Darwin":  # macOS
                if not self._check_command_exists('softwareupdate'):
                    return {"status": "unknown", "details": "Software Update command not found"}
                result = subprocess.run(['softwareupdate', '-l'], capture_output=True, text=True)
                updates = result.stdout
            else:  # Linux
                if os.path.exists('/etc/debian_version'):
                    if not self._check_command_exists('apt-get'):
                        return {"status": "unknown", "details": "APT command not found"}
                    result = subprocess.run(['apt-get', '-s', 'upgrade'], capture_output=True, text=True)
                else:
                    if not self._check_command_exists('yum'):
                        return {"status": "unknown", "details": "YUM command not found"}
                    result = subprocess.run(['yum', 'check-update'], capture_output=True, text=True)
                updates = result.stdout

            return {
                "status": "up_to_date" if "No updates" in updates else "updates_available",
                "details": updates
            }
        except Exception as e:
            logging.error(f"Error checking OS updates: {str(e)}")
            return {"status": "unknown", "details": str(e)}

    def check_antivirus(self) -> Dict[str, Any]:
        """Check antivirus presence and status."""
        try:
            if platform.system() == "Windows":
                if not self._check_command_exists('powershell'):
                    return {"status": "unknown", "details": "PowerShell command not found"}
                result = subprocess.run(['powershell', 'Get-MpComputerStatus'], capture_output=True, text=True)
                is_active = "AntivirusEnabled : True" in result.stdout
                antivirus_name = "Windows Defender"
            elif platform.system() == "Darwin":  # macOS
                if not self._check_command_exists('/usr/libexec/PlistBuddy'):
                    return {"status": "unknown", "details": "PlistBuddy command not found"}
                result = subprocess.run(['/usr/libexec/PlistBuddy', '-c', 'Print', '/Library/Preferences/com.apple.security.settings.plist'], capture_output=True, text=True)
                is_active = "Gatekeeper" in result.stdout
                antivirus_name = "macOS Security"
            else:  # Linux
                if not self._check_command_exists('clamav'):
                    return {"status": "unknown", "details": "ClamAV command not found"}
                result = subprocess.run(['which', 'clamav'], capture_output=True, text=True)
                is_active = bool(result.stdout)
                antivirus_name = "ClamAV" if is_active else "None"

            return {
                "status": "active" if is_active else "inactive",
                "name": antivirus_name,
                "details": result.stdout if result.stdout else "Unknown"
            }
        except Exception as e:
            logging.error(f"Error checking antivirus: {str(e)}")
            return {"status": "unknown", "details": str(e)}

    def check_sleep_settings(self) -> Dict[str, Any]:
        """Check inactivity sleep settings."""
        try:
            if platform.system() == "Windows":
                if not self._check_command_exists('powercfg'):
                    return {"status": "unknown", "details": "PowerCfg command not found"}
                result = subprocess.run(['powercfg', '/query', 'SCHEME_CURRENT', 'SUB_SLEEP'], capture_output=True, text=True)
                # Extract the sleep time from the output
                sleep_time = 0  # Default value
                for line in result.stdout.split('\n'):
                    if 'AC Setting Index' in line:
                        sleep_time = int(line.split(':')[1].strip())
                        break
            elif platform.system() == "Darwin":  # macOS
                if not self._check_command_exists('pmset'):
                    return {"status": "unknown", "details": "PMSet command not found"}
                result = subprocess.run(['pmset', '-g'], capture_output=True, text=True)
                sleep_time = int(result.stdout.split('\n')[1].split()[1])
            else:  # Linux
                if not os.path.exists('/sys/power/mem_sleep'):
                    return {"status": "unknown", "details": "Sleep settings file not found"}
                result = subprocess.run(['cat', '/sys/power/mem_sleep'], capture_output=True, text=True)
                sleep_time = 0  # Default for Linux

            return {
                "status": "ok" if sleep_time <= 10 else "too_long",
                "sleep_time_minutes": sleep_time,
                "details": result.stdout if result.stdout else "Unknown"
            }
        except Exception as e:
            logging.error(f"Error checking sleep settings: {str(e)}")
            return {"status": "unknown", "details": str(e)}

    def check_server_connection(self) -> bool:
        """Check if server is available and API key is valid."""
        try:
            response = requests.get(
                f"{self.api_url}/health",
                headers={"X-API-Key": self.api_key},
                timeout=5
            )
            return response.status_code == 200
        except requests.exceptions.RequestException as e:
            logging.error(f"Server connection failed: {str(e)}")
            return False

    def wait_for_server(self, max_retries: int = 5, retry_interval: int = 5) -> bool:
        """Wait for server to become available."""
        for attempt in range(max_retries):
            if self.check_server_connection():
                logging.info("Server is available!")
                return True
            logging.warning(f"Server not available. Retrying in {retry_interval} seconds... (Attempt {attempt + 1}/{max_retries})")
            time.sleep(retry_interval)
        logging.error("Server not available after maximum retries")
        return False

    def get_system_info(self) -> Dict[str, Any]:
        """Get system information."""
        try:
            self._update_resource_usage()
            return {
                'machine_id': self.machine_id,
                'timestamp': datetime.now().isoformat(),
                'os': {
                    'system': platform.system(),
                    'version': platform.version(),
                    'release': platform.release()
                },
                'checks': {
                    'disk_encryption': self.check_disk_encryption(),
                    'os_updates': self.check_os_updates(),
                    'antivirus': self.check_antivirus(),
                    'sleep_settings': self.check_sleep_settings()
                },
                'resource_usage': self.resource_usage
            }
        except Exception as e:
            logging.error(f"Error getting system info: {str(e)}")
            return {}

    def send_data(self, data: Dict[str, Any]) -> bool:
        """Send data to the server with retry logic."""
        max_retries = 3
        retry_interval = 5

        for attempt in range(max_retries):
            try:
                logging.debug(f"Sending data to {self.api_url}/system-data")
                logging.debug(f"Using API key: {self.api_key[:4]}...{self.api_key[-4:]}")
                
                response = requests.post(
                    f"{self.api_url}/system-data",
                    json=data,
                    headers={
                        "X-API-Key": self.api_key,
                        "Content-Type": "application/json"
                    },
                    timeout=10
                )
                
                if response.status_code == 200:
                    logging.info("Data sent successfully")
                    return True
                else:
                    logging.error(f"Server returned status code {response.status_code}: {response.text}")
                    
            except requests.exceptions.RequestException as e:
                logging.error(f"Request failed (attempt {attempt + 1}/{max_retries}): {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(retry_interval)
                    continue
                
        logging.error("Failed to send system data")
        return False

    def run(self):
        """Main loop with server availability check."""
        if not self.wait_for_server():
            logging.error("Cannot start system checker: server is not available")
            return

        while True:
            try:
                data = self.get_system_info()
                if data:
                    self.send_data(data)
                time.sleep(self.check_interval)
            except KeyboardInterrupt:
                logging.info("System checker stopped by user")
                break
            except Exception as e:
                logging.error(f"Error in main loop: {str(e)}")
                time.sleep(self.check_interval)

def main():
    checker = SystemChecker()
    checker.run()

if __name__ == "__main__":
    main() 