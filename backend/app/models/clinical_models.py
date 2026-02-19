from sqlmodel import SQLModel, Field, JSON
from datetime import datetime
from typing import Optional, Dict

class ClinicalRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: str = Field(index=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Liver Function Test (LFT)
    lft: Dict = Field(default={}, sa_type=JSON) 
    # Example: {"alt": 45, "ast": 40, "alp": 120, "bilirubin": 1.2}

    # Kidney Function Test (KFT)
    kft: Dict = Field(default={}, sa_type=JSON)
    # Example: {"creatinine": 1.1, "egfr": 85, "bun": 15}

    # Metabolic
    hba1c: Optional[float] = Field(default=None)
    
    # Lipid Profile
    lipid_profile: Dict = Field(default={}, sa_type=JSON)
    # Example: {"cholesterol": 200, "ldl": 130, "hdl": 50, "triglycerides": 150}

    # Mental Health / Behavioral
    gad7_score: Optional[int] = Field(default=None, description="Generalized Anxiety Disorder-7 Score (0-21)")
    phq9_score: Optional[int] = Field(default=None, description="Patient Health Questionnaire-9 Score (0-27)")
    stress_level: Optional[int] = Field(default=None, description="Self-reported stress level (1-10)")
    
    behavioral_notes: Optional[str] = Field(default=None)
