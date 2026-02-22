from sqlmodel import Session, select
from app.core.database import engine
from app.models.clinical_models import ClinicalRecord
from app.models.appointment_models import Appointment

def check_all_data():
    with Session(engine) as session:
        print("--- CLINICAL RECORDS ---")
        cl_results = session.exec(select(ClinicalRecord)).all()
        print(f"Total Clinical Records: {len(cl_results)}")
        for rec in cl_results:
            print(f" ID: {rec.id}, Patient: {rec.patient_id}, Time: {rec.timestamp}")

        print("\n--- APPOINTMENTS ---")
        ap_results = session.exec(select(Appointment)).all()
        print(f"Total Appointments: {len(ap_results)}")
        for rec in ap_results:
            print(f" ID: {rec.id}, Patient: {rec.patient_name}, Time: {rec.appointment_date}")

if __name__ == "__main__":
    check_all_data()
