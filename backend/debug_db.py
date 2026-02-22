from sqlmodel import Session, select
from app.core.database import engine
from app.models.clinical_models import ClinicalRecord

def check_data():
    with Session(engine) as session:
        statement = select(ClinicalRecord).where(ClinicalRecord.patient_id == "demo-patient-001")
        results = session.exec(statement).all()
        print(f"Total records for demo-patient-001: {len(results)}")
        for idx, rec in enumerate(results):
            print(f"\nRecord {idx+1} (ID: {rec.id}):")
            print(f"  Timestamp: {rec.timestamp}")
            print(f"  LFT: {rec.lft}")
            print(f"  KFT: {rec.kft}")
            print(f"  Lipid Profile: {rec.lipid_profile}")
            print(f"  HbA1c: {rec.hba1c}")

if __name__ == "__main__":
    check_data()
