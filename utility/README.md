# System Health Checker Utility

A cross-platform utility for collecting and reporting system health data.

## Features

- Disk encryption status check
- OS update status monitoring
- Antivirus presence and status verification
- Sleep settings validation
- Automatic data reporting to backend server
- Cross-platform support (Windows, macOS, Linux)

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

Run the utility:
```bash
python system_checker.py
```

The utility will:
1. Run system health checks every 15 minutes
2. Send data to the backend server if changes are detected
3. Log all activities to `system_checker.log`

## Configuration

The utility can be configured by modifying the following parameters in `system_checker.py`:
- `api_url`: Backend server URL (default: http://localhost:5000)
- Check interval: Modify the `time.sleep()` value in the `main()` function

## Logging

Logs are written to:
- Console output
- `system_checker.log` file

## Error Handling

The utility includes comprehensive error handling for:
- System check failures
- Network connectivity issues
- API communication problems

All errors are logged with appropriate context for debugging. 