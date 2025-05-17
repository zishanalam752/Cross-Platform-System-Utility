import os
from pathlib import Path

def create_env_file():
    # Get the current directory
    current_dir = Path.cwd()
    
    # Create utility/.env
    utility_env_path = current_dir / 'utility' / '.env'
    utility_env_content = """API_KEY=system-monitor-secure-key-2024
API_URL=http://localhost:5000
CHECK_INTERVAL=900"""
    
    with open(utility_env_path, 'w', encoding='utf-8') as f:
        f.write(utility_env_content)
    print(f"Created {utility_env_path}")
    
    # Create server/.env
    server_env_path = current_dir / 'server' / '.env'
    server_env_content = "API_KEY=system-monitor-secure-key-2024"
    
    with open(server_env_path, 'w', encoding='utf-8') as f:
        f.write(server_env_content)
    print(f"Created {server_env_path}")

if __name__ == '__main__':
    create_env_file() 