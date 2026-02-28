from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import AnalysisResult, GeneProfile, ChatRequest, ChatResponse
from app.models.models import AnalysisRecord
from app.models.pgx_models import StarAllele, DiplotypeDefinition, DrugGeneInteraction, Patient
from app.services.risk_classifier import RiskClassifier
from app.core.database import create_db_and_tables, get_session, engine
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from typing import List
import uvicorn
import shutil
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

def seed_data():
    with Session(engine) as session:
        # Check API Key
        import os
        key = os.getenv("GEMINI_API_KEY")
        if key:
            print(f"✅ GEMINI_API_KEY found: {key[:4]}...{key[-4:]}")
        else:
            print("❌ GEMINI_API_KEY NOT FOUND in environment")

        # Check if data exists
        if session.exec(select(StarAllele)).first():
            return

        print("Seeding Initial PGx Data...")
        
        # 1. Star Alleles
        alleles = [
            StarAllele(gene="CYP2C19", rsid="rs4244285", allele="*2", functional_effect="No Function"),
            StarAllele(gene="CYP2C19", rsid="rs4986893", allele="*3", functional_effect="No Function"),
            StarAllele(gene="CYP2D6", rsid="rs3892097", allele="*4", functional_effect="No Function"),
        ]
        session.add_all(alleles)
        
        # 2. Diplotypes
        diplotypes = [
            DiplotypeDefinition(gene="CYP2C19", diplotype="*1/*1", phenotype="Normal Metabolizer", activity_score=2.0),
            DiplotypeDefinition(gene="CYP2C19", diplotype="*1/*2", phenotype="Intermediate Metabolizer", activity_score=1.0),
            DiplotypeDefinition(gene="CYP2C19", diplotype="*2/*2", phenotype="Poor Metabolizer", activity_score=0.0),
            DiplotypeDefinition(gene="CYP2C19", diplotype="*1/*17", phenotype="Rapid Metabolizer", activity_score=2.5),
            DiplotypeDefinition(gene="CYP2D6", diplotype="*4/*4", phenotype="Poor Metabolizer", activity_score=0.0),
            DiplotypeDefinition(gene="CYP2D6", diplotype="*1/*4", phenotype="Intermediate Metabolizer", activity_score=1.0),
        ]
        session.add_all(diplotypes)
        
        # 3. Drug-Gene Interactions
        interactions = [
            DrugGeneInteraction(
                drug="Clopidogrel", gene="CYP2C19", phenotype="Poor Metabolizer",
                risk_category="Ineffective", recommendation="Avoid clopidogrel. Consider prasugrel or ticagrelor.", evidence_level="A"
            ),
            DrugGeneInteraction(
                drug="Clopidogrel", gene="CYP2C19", phenotype="Intermediate Metabolizer",
                risk_category="Adjust Dose", recommendation="Consider alternative or higher dose.", evidence_level="B"
            ),
            DrugGeneInteraction(
                drug="Codeine", gene="CYP2D6", phenotype="Poor Metabolizer",
                risk_category="Ineffective", recommendation="Avoid codeine causing lack of efficacy.", evidence_level="A"
            ),
             DrugGeneInteraction(
                drug="Codeine", gene="CYP2D6", phenotype="Ultrarapid Metabolizer",
                risk_category="Toxic", recommendation="Avoid codeine due to risk of toxicity.", evidence_level="A"
            ),
        ]
        session.add_all(interactions)
        
        session.commit()
        print("Seeding Complete.")

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     create_db_and_tables()
#     seed_data()
#     yield

app = FastAPI(title="PharmaGuard API", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
risk_classifier = RiskClassifier()
from app.services.llm_service import LLMService
llm_service = LLMService()

@app.get("/")
def read_root():
    return {"message": "Welcome to PharmaGuard API"}

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_genomics(
    file: UploadFile = File(...),
    drug: str = Form(...)
):
    try:
        # Read file content
        content = await file.read()
        vcf_content = content.decode("utf-8")
        
        # Run analysis
        result = risk_classifier.analyze(vcf_content, drug)
        
        return result

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/profile", response_model=List[GeneProfile])
async def get_genomic_profile(
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        vcf_content = content.decode("utf-8")
        
        profiles = risk_classifier.get_patient_profile(vcf_content)
        return profiles
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[AnalysisRecord])
def get_history(session: Session = Depends(get_session), limit: int = 50):
    records = session.exec(select(AnalysisRecord).order_by(AnalysisRecord.timestamp.desc()).limit(limit)).all()
    return records

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Pass the context (if any) to the LLM service
        response_text = llm_service.chat(request.message, context=request.context)
        return ChatResponse(response=response_text)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Clinical Data Endpoints
from app.models.clinical_models import ClinicalRecord

@app.post("/patient/clinical", response_model=ClinicalRecord)
def save_clinical_data(record: ClinicalRecord, session: Session = Depends(get_session)):
    try:
        print(f"📥 Received Clinical Data for Patient: {record.patient_id}")
        print(f"   LFT: {record.lft}")
        print(f"   KFT: {record.kft}")
        session.add(record)
        session.commit()
        session.refresh(record)
        print(f"✅ Saved Record ID: {record.id}")
        return record
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patient/clinical/{patient_id}", response_model=List[ClinicalRecord])
def get_clinical_data(patient_id: str, session: Session = Depends(get_session)):
    # Get latest records first
    records = session.exec(select(ClinicalRecord).where(ClinicalRecord.patient_id == patient_id).order_by(ClinicalRecord.timestamp.desc())).all()
    return records

# Appointment Endpoints
from app.models.appointment_models import Appointment

@app.post("/api/book-appointment", response_model=Appointment)
def book_appointment(appointment: Appointment, session: Session = Depends(get_session)):
    try:
        session.add(appointment)
        session.commit()
        session.refresh(appointment)
        return appointment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/appointments", response_model=List[Appointment])
def get_appointments(session: Session = Depends(get_session)):
    return session.exec(select(Appointment).order_by(Appointment.created_at.desc())).all()

create_db_and_tables()
try:
    seed_data()
except Exception as e:
    print("Seed data failed:", e)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
