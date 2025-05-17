import logging
from config import Config

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def test_config():
    try:
        logger.info("Attempting to load configuration...")
        config = Config()
        logger.info("Configuration loaded successfully!")
        logger.info(f"API Endpoint: {config.api_endpoint}")
        logger.info(f"API Key: {'Set' if config.api_key else 'Not set'}")
        logger.info(f"Check Interval: {config.check_interval}")
    except Exception as e:
        logger.error(f"Error loading configuration: {str(e)}", exc_info=True)

if __name__ == "__main__":
    test_config() 