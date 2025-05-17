# System Health Monitoring System

A cross-platform system health monitoring solution that collects and reports system health data to a central server.

## Features

### System Utility (Client)
- Cross-platform support (Windows, macOS, Linux)
- Monitors:
  - Disk encryption status
  - OS update status
  - Antivirus presence and status
  - Inactivity sleep settings
  - Resource usage (CPU, Memory, Disk)
- Configurable check intervals
- Secure API communication
- Detailed logging
- Error handling and recovery

### Backend Server
- RESTful API endpoints
- Secure API key authentication
- SQLite database for data storage
- Machine listing and filtering
- Historical data access
- CSV export functionality
- Health check endpoint
- Comprehensive error handling
- Detailed logging

## Installation

### Server Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/system-health-monitor.git
cd system-health-monitor
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install server dependencies:
```bash
cd server
pip install -r requirements.txt
```

4. Create a `.env` file in the server directory:
```
API_KEY=your-secure-api-key
```

5. Start the server:
```bash
python server.py
```

### Client Setup

1. Install the client package:
```bash
pip install -e .
```

2. Create a `.env` file in your home directory:
```
API_KEY=your-secure-api-key
API_URL=http://your-server-address:5000
```

3. Run the system monitor:
```bash
system-monitor
```

## API Endpoints

### Server Endpoints

- `POST /system-data`: Submit system health data
- `GET /machines`: List all machines with their latest status
- `GET /machine/<machine_id>`: Get latest status for a specific machine
- `GET /machine/<machine_id>/history`: Get historical data for a machine
  - Query parameters:
    - `start_date`: Filter by start date (ISO format)
    - `end_date`: Filter by end date (ISO format)
    - `limit`: Maximum number of records to return (default: 100)
- `GET /export/csv`: Export data to CSV
  - Query parameters:
    - `start_date`: Filter by start date (ISO format)
    - `end_date`: Filter by end date (ISO format)
    - `machine_id`: Filter by machine ID
- `GET /health`: Server health check

## Development

### Project Structure
```
system-health-monitor/
├── server/
│   ├── server.py
│   └── requirements.txt
├── utility/
│   ├── system_checker.py
│   └── config.py
├── setup.py
└── README.md
```

### Adding New Checks

To add a new system check:

1. Add a new method to the `SystemChecker` class in `utility/system_checker.py`
2. Update the `collect_system_data` method to include the new check
3. Update the server's CSV export functionality if needed

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
