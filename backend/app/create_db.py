from app.core.database import create_db_and_tables
from app.main import seed_data
from sqlmodel import Session, select
from app.core.database import engine
from app.models.pgx_models import StarAllele, DiplotypeDefinition, DrugGeneInteraction
from app.models.appointment_models import Appointment

def init_db():
    print("Creating database and tables...")
    create_db_and_tables()
    print("Tables created.")
    
    print("Seeding data...")
    seed_data()
    print("Seeding complete.")
    
    # Verify
    with Session(engine) as session:
        alleles = session.exec(select(StarAllele)).all()
        diplotypes = session.exec(select(DiplotypeDefinition)).all()
        interactions = session.exec(select(DrugGeneInteraction)).all()
        
        print(f"\nVerification:")
        print(f"Star Alleles: {len(alleles)}")
        print(f"Diplotypes: {len(diplotypes)}")
        print(f"Drug-Gene Interactions: {len(interactions)}")

if __name__ == "__main__":
    init_db()
