from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class AnalysisRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: str = Field(index=True)
    drug: str = Field(index=True)
    timestamp: datetime = Field(default_factory=datetime.now)
    
    # Key Summary Fields for quick listing
    primary_gene: str
    phenotype: str
    diplotype: str
    risk_label: str
    recommendation: str
    
    # Store full detailed result as JSON string
    full_result_json: str
