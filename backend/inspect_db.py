from sqlmodel import Session, select, create_engine
import os
from app.models.clinical_models import ClinicalRecord
from app.core.database import database_url

engine = create_engine(database_url)

def check_records():
    with Session(engine) as session:
        statement = select(ClinicalRecord)
        results = session.exec(statement).all()
        print(f"Total clinical records: {len(results)}")
        for record in results:
            print(f"ID: {record.id}, Patient: {record.patient_id}, Timestamp: {record.timestamp}")
            print(f"  LFT: {record.lft}")
            print(f"  KFT: {record.kft}")
            print(f"  Lipid: {record.lipid_profile}")

if __name__ == "__main__":
    check_records()
