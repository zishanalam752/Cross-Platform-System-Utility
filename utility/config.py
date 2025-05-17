import os
from dotenv import load_dotenv
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class Config:
    def __init__(self):
        # Load environment variables from .env file if it exists
        load_dotenv()
        
        # Get configuration from environment variables with defaults
        self.api_key = os.getenv('API_KEY', "system-monitor-secure-key-2024")
        self.api_url = os.getenv('API_URL', "http://localhost:5000")
        
        # Check interval in seconds (15-60 minutes)
        default_interval = 900  # 15 minutes
        try:
            interval = int(os.getenv('CHECK_INTERVAL', default_interval))
            # Ensure interval is between 15 and 60 minutes
            self.check_interval = max(900, min(3600, interval))
        except ValueError:
            self.check_interval = default_interval
        
        # Set environment variables
        os.environ['API_KEY'] = self.api_key
        os.environ['API_URL'] = self.api_url
        os.environ['CHECK_INTERVAL'] = str(self.check_interval)
        
        # Log configuration
        logging.debug("Loaded configuration:")
        logging.debug(f"API Endpoint: {self.api_url}")
        logging.debug(f"API Key: {'Set' if self.api_key else 'Not set'}")
        if self.api_key:
            logging.debug(f"API Key length: {len(self.api_key)}")
        logging.debug(f"Check Interval: {self.check_interval} seconds ({self.check_interval/60:.1f} minutes)")
        
        # Debug print statements
        print("DEBUG: self.api_key =", repr(self.api_key))
        print("DEBUG: os.environ['API_KEY'] =", repr(os.environ.get('API_KEY')))
        print("DEBUG: self.api_url =", repr(self.api_url))
        print("DEBUG: os.environ['API_URL'] =", repr(os.environ.get('API_URL')))
        print("DEBUG: self.check_interval =", repr(self.check_interval))
        print("DEBUG: os.environ['CHECK_INTERVAL'] =", repr(os.environ.get('CHECK_INTERVAL'))) 