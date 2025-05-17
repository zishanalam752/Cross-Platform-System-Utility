# System Health Checker Backend Server

A Flask-based backend server for collecting and managing system health data from multiple machines.

## Features

- RESTful API endpoints for system data collection
- SQLite database for data storage
- Machine status tracking
- Historical data access
- Cross-Origin Resource Sharing (CORS) support

## API Endpoints

### POST /system-data
Receives system health data from clients.

### GET /machines
Returns a list of all machines with their latest status.

### GET /machine/<machine_id>
Returns detailed information for a specific machine.

### GET /machine/<machine_id>/history
Returns historical data for a specific machine.

## Requirements

- Python 3.7 or higher
- Required Python packages (see requirements.txt)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Start the server:
```bash
python server.py
```

The server will:
1. Initialize the SQLite database
2. Start listening on port 5000
3. Accept connections from all interfaces (0.0.0.0)

## Database

The server uses SQLite for data storage. The database file (`system_data.db`) will be created automatically in the server directory.

## Configuration

The server can be configured by modifying the following parameters in `server.py`:
- Port number (default: 5000)
- Database file location
- CORS settings

## Error Handling

The server includes comprehensive error handling for:
- Invalid data
- Database operations
- API requests
- Missing resources

All errors are returned with appropriate HTTP status codes and error messages. 