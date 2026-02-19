from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Appointment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_name: str
    email: str
    phone: str
    drug: Optional[str] = None
    risk_label: Optional[str] = None
    doctor_specialization: str
    appointment_date: str
    appointment_time: str
    consultation_type: str  # "Online" or "In-person"
    status: str = "Confirmed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
