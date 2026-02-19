from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime

class StarAllele(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    gene: str = Field(index=True)
    rsid: str = Field(index=True)
    allele: str
    functional_effect: str
    
class DiplotypeDefinition(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    gene: str = Field(index=True)
    diplotype: str = Field(index=True) # e.g. *1/*4
    phenotype: str
    activity_score: float

class DrugGeneInteraction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    drug: str = Field(index=True)
    gene: str = Field(index=True)
    phenotype: str
    risk_category: str # Ineffective, Toxic, Safe, Adjust Dose
    recommendation: str
    evidence_level: str

class Patient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: str = Field(index=True, unique=True)
    age: Optional[int] = None
    sex: Optional[str] = None
    weight: Optional[float] = None
    ethnicity: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
