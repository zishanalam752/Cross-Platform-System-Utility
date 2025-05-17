import requests
import json

def test_server():
    # Test data
    test_data = {
        "machine_id": "test-machine",
        "timestamp": "2024-03-19T12:00:00",
        "checks": {
            "disk_encryption": {"status": "encrypted"},
            "os_updates": {"status": "up_to_date"},
            "antivirus": {"status": "active"},
            "sleep_settings": {"status": "ok"}
        }
    }

    # Test POST request
    print("Testing POST /api/system-data...")
    response = requests.post(
        "http://localhost:5000/api/system-data",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")

    # Test GET request
    print("\nTesting GET /api/machines...")
    response = requests.get("http://localhost:5000/api/machines")
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_server() 