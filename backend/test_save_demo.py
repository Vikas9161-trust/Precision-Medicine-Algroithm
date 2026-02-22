import requests
import json

def test_save():
    url = "http://127.0.0.1:8000/patient/clinical"
    payload = {
        "patient_id": "demo-patient-001",
        "lft": {"alt": 25, "ast": 22, "alp": 110, "bilirubin": 0.8},
        "kft": {"creatinine": 0.9, "egfr": 95, "bun": 12},
        "hba1c": 5.4,
        "lipid_profile": {"cholesterol": 180, "ldl": 110, "hdl": 55, "triglycerides": 140}
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_save()
