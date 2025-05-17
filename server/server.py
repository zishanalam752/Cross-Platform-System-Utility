from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime, timedelta
import csv
import io
from typing import Dict, List, Any, Optional
import logging
from functools import wraps
from dotenv import load_dotenv

# Explicitly load .env from the server directory
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Set API key directly for testing
os.environ['API_KEY'] = 'system-monitor-secure-key-2024'

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Changed to DEBUG for more detailed logs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('server.log'),
        logging.StreamHandler()
    ]
)

# Log the API key for debugging (first 4 and last 4 chars)
api_key = os.getenv('API_KEY')
if api_key:
    logging.info(f"API Key loaded: {api_key[:4]}...{api_key[-4:]}")
else:
    logging.warning("No API key found in environment variables")

app = Flask(__name__)
CORS(app)

# Health check endpoint - moved to top
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint that returns 200 OK."""
    logging.debug("Health check endpoint called")
    return jsonify({"status": "healthy"}), 200

# Database setup
def init_db():
    conn = sqlite3.connect('system_data.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS system_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            machine_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            data TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect('system_data.db')
    conn.row_factory = sqlite3.Row
    return conn

# API key validation decorator
def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        expected_key = os.getenv('API_KEY')
        logging.debug(f"Received API key: {api_key[:4]}...{api_key[-4:] if api_key else 'None'}")
        logging.debug(f"Expected API key: {expected_key[:4]}...{expected_key[-4:] if expected_key else 'None'}")
        if not api_key or api_key != expected_key:
            logging.warning(f"Invalid API key attempt from {request.remote_addr}")
            return jsonify({"error": "Invalid API key"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Error handling decorator
def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logging.error(f"Error in {f.__name__}: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
    return decorated_function

@app.route('/system-data', methods=['POST'])
@require_api_key
@handle_errors
def receive_system_data():
    data = request.json
    if not data:
        logging.error("No data provided in request")
        return jsonify({"error": "No data provided"}), 400

    required_fields = ['machine_id', 'timestamp', 'checks']
    if not all(field in data for field in required_fields):
        logging.error(f"Missing required fields. Received: {list(data.keys())}")
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_db()
        c = conn.cursor()
        c.execute(
            'INSERT INTO system_data (machine_id, timestamp, data) VALUES (?, ?, ?)',
            (data['machine_id'], data['timestamp'], json.dumps(data))
        )
        conn.commit()
        conn.close()

        logging.info(f"Successfully received data from machine {data['machine_id']}")
        return jsonify({"status": "success"}), 200
    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({"error": "Database error"}), 500

@app.route('/machines', methods=['GET'])
@require_api_key
@handle_errors
def list_machines():
    conn = get_db()
    c = conn.cursor()
    
    # Get unique machines with their latest data
    c.execute('''
        SELECT DISTINCT machine_id, 
               (SELECT data FROM system_data 
                WHERE machine_id = sd.machine_id 
                ORDER BY timestamp DESC LIMIT 1) as latest_data
        FROM system_data sd
    ''')
    
    machines = []
    for row in c.fetchall():
        data = json.loads(row['latest_data'])
        machines.append({
            'machine_id': row['machine_id'],
            'last_seen': data['timestamp'],
            'os': data['os'],
            'status': {
                'disk_encryption': data['checks']['disk_encryption']['status'],
                'os_updates': data['checks']['os_updates']['status'],
                'antivirus': data['checks']['antivirus']['status'],
                'sleep_settings': data['checks']['sleep_settings']['status']
            }
        })
    
    conn.close()
    return jsonify(machines)

@app.route('/machine/<machine_id>', methods=['GET'])
@require_api_key
@handle_errors
def get_machine_status(machine_id: str):
    conn = get_db()
    c = conn.cursor()
    
    # Get latest data for the machine
    c.execute('''
        SELECT data FROM system_data 
        WHERE machine_id = ? 
        ORDER BY timestamp DESC LIMIT 1
    ''', (machine_id,))
    
    row = c.fetchone()
    if not row:
        return jsonify({"error": "Machine not found"}), 404
    
    data = json.loads(row['data'])
    
    # Transform the data to match the client's expected structure
    transformed_data = {
        'machine_id': data['machine_id'],
        'last_seen': data['timestamp'],
        'os': data['os'],
        'status': {
            'disk_encryption': data['checks']['disk_encryption'],
            'os_updates': data['checks']['os_updates'],
            'antivirus': data['checks']['antivirus'],
            'sleep_settings': data['checks']['sleep_settings']
        },
        'checks': data['checks']
    }
    
    conn.close()
    return jsonify(transformed_data)

@app.route('/machine/<machine_id>/history', methods=['GET'])
@require_api_key
@handle_errors
def get_machine_history(machine_id: str):
    # Get query parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = request.args.get('limit', default=100, type=int)
    
    conn = get_db()
    c = conn.cursor()
    
    query = 'SELECT data FROM system_data WHERE machine_id = ?'
    params = [machine_id]
    
    if start_date:
        query += ' AND timestamp >= ?'
        params.append(start_date)
    if end_date:
        query += ' AND timestamp <= ?'
        params.append(end_date)
    
    query += ' ORDER BY timestamp DESC LIMIT ?'
    params.append(limit)
    
    c.execute(query, params)
    history = [json.loads(row['data']) for row in c.fetchall()]
    
    conn.close()
    return jsonify(history)

@app.route('/export/csv', methods=['GET'])
@require_api_key
@handle_errors
def export_csv():
    # Get query parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    machine_id = request.args.get('machine_id')
    os_system = request.args.get('os_system')
    status_filter = request.args.get('status')  # e.g., 'encrypted', 'up_to_date', etc.
    check_type = request.args.get('check_type')  # e.g., 'disk_encryption', 'os_updates', etc.
    
    conn = get_db()
    c = conn.cursor()
    
    query = 'SELECT data FROM system_data'
    params = []
    
    conditions = []
    if start_date:
        conditions.append('timestamp >= ?')
        params.append(start_date)
    if end_date:
        conditions.append('timestamp <= ?')
        params.append(end_date)
    if machine_id:
        conditions.append('machine_id = ?')
        params.append(machine_id)
    
    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)
    
    query += ' ORDER BY timestamp DESC'
    
    c.execute(query, params)
    rows = c.fetchall()
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'Timestamp', 'Machine ID', 'OS System', 'OS Version', 'OS Release',
        'Disk Encryption Status', 'Disk Encryption Details',
        'OS Updates Status', 'OS Updates Details',
        'Antivirus Status', 'Antivirus Name', 'Antivirus Details',
        'Sleep Settings Status', 'Sleep Time (minutes)', 'Sleep Settings Details',
        'CPU Usage %', 'Memory Usage %', 'Disk Usage %'
    ])
    
    # Write data
    for row in rows:
        data = json.loads(row['data'])
        
        # Apply additional filters
        if os_system and data['os']['system'].lower() != os_system.lower():
            continue
            
        if status_filter and check_type:
            check_data = data['checks'].get(check_type, {})
            if check_data.get('status') != status_filter:
                continue
        
        writer.writerow([
            data['timestamp'],
            data['machine_id'],
            data['os']['system'],
            data['os']['version'],
            data['os']['release'],
            data['checks']['disk_encryption']['status'],
            data['checks']['disk_encryption'].get('details', ''),
            data['checks']['os_updates']['status'],
            data['checks']['os_updates'].get('details', ''),
            data['checks']['antivirus']['status'],
            data['checks']['antivirus'].get('name', ''),
            data['checks']['antivirus'].get('details', ''),
            data['checks']['sleep_settings']['status'],
            data['checks']['sleep_settings'].get('sleep_time_minutes', ''),
            data['checks']['sleep_settings'].get('details', ''),
            data.get('resource_usage', {}).get('cpu_percent', 'N/A'),
            data.get('resource_usage', {}).get('memory_percent', 'N/A'),
            data.get('resource_usage', {}).get('disk_usage_percent', 'N/A')
        ])
    
    # Prepare the response
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=system_health_report.csv'
    
    conn.close()
    return response

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True) 