import requests
import json

BASE_URL = "http://localhost:8000"

def test_booking():
    print(f"Testing connection to {BASE_URL}...")
    
    # 1. Book an Appointment
    payload = {
        "patient_name": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "drug": "Aspirin",
        "risk_label": "Low",
        "doctor_specialization": "Cardiology",
        "appointment_date": "2026-03-10",
        "appointment_time": "10:00 AM",
        "consultation_type": "Online",
        "status": "Confirmed"
    }
    
    print("\nAttempting to book appointment...")
    try:
        response = requests.post(f"{BASE_URL}/api/book-appointment", json=payload)
        
        if response.status_code == 200:
            print("✅ Booking Successful!")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ Booking Failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Exception during booking: {e}")

    # 2. Fetch Appointments
    print("\nFetching all appointments...")
    try:
        response = requests.get(f"{BASE_URL}/api/appointments")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Fetched {len(data)} appointments.")
            print(json.dumps(data, indent=2))
        else:
            print(f"❌ Fetch Failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Exception during fetch: {e}")

if __name__ == "__main__":
    test_booking()
