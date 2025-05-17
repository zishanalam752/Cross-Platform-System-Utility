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
        # Directly set the configuration values
        self.api_key = "system-monitor-secure-key-2024"
        self.api_url = "http://localhost:5000"
        self.check_interval = 900
        
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
        
        # Debug print statements
        print("DEBUG: self.api_key =", repr(self.api_key))
        print("DEBUG: os.environ['API_KEY'] =", repr(os.environ.get('API_KEY')))
        print("DEBUG: self.api_url =", repr(self.api_url))
        print("DEBUG: os.environ['API_URL'] =", repr(os.environ.get('API_URL')))
        print("DEBUG: self.check_interval =", repr(self.check_interval))
        print("DEBUG: os.environ['CHECK_INTERVAL'] =", repr(os.environ.get('CHECK_INTERVAL'))) 