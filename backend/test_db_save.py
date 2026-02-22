from sqlmodel import Session, create_engine
from app.core.database import database_url
from app.models.clinical_models import ClinicalRecord
from app.models.appointment_models import Appointment
from datetime import datetime

engine = create_engine(database_url)

def test_save():
    with Session(engine) as session:
        try:
            print("Testing ClinicalRecord save...")
            crecord = ClinicalRecord(
                patient_id="test-patient",
                lft={"alt": 10},
                kft={"creatinine": 1.0},
                lipid_profile={"cholesterol": 200}
            )
            session.add(crecord)
            session.commit()
            print("ClinicalRecord saved successfully!")
            
            print("Testing Appointment save...")
            appt = Appointment(
                patient_name="Test User",
                email="test@example.com",
                phone="1234567890",
                doctor_specialization="Geneticist",
                appointment_date="2024-12-01",
                appointment_time="10:00",
                consultation_type="Online"
            )
            session.add(appt)
            session.commit()
            print("Appointment saved successfully!")
            
        except Exception as e:
            print(f"Error during save: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_save()
