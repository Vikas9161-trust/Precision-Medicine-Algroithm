from sqlmodel import Session, select
from app.core.database import engine
from app.models.clinical_models import ClinicalRecord

def dump_data():
    with Session(engine) as session:
        records = session.exec(select(ClinicalRecord)).all()
        for r in records:
            print(f"ID={r.id} | Patient={r.patient_id} | Time={r.timestamp}")
            print(f"  LFT: {r.lft}")
            print(f"  KFT: {r.kft}")
            print(f"  HbA1c: {r.hba1c}")

if __name__ == "__main__":
    dump_data()
