from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RiskAssessment(BaseModel):
    risk_label: str = Field(..., description="Risk level: Safe, Adjust Dosage, Toxic, Ineffective, Unknown")
    confidence_score: float = Field(..., ge=0, le=1, description="Confidence score of the prediction")
    severity: str = Field(..., description="Severity level: low, moderate, high, critical")

class DetectedVariant(BaseModel):
    rsid: str
    genotype: str

class PharmacogenomicProfile(BaseModel):
    primary_gene: str
    diplotype: str
    phenotype: str
    detected_variants: List[DetectedVariant]

class ClinicalRecommendation(BaseModel):
    recommendation_text: str

class LLMGeneratedExplanation(BaseModel):
    summary: str
    mechanism: str
    clinical_interpretation: str

class QualityMetrics(BaseModel):
    vcf_parsing_success: bool
    rule_engine_match: bool
    llm_validation_status: str

class AnalysisResult(BaseModel):
    patient_id: str
    drug: str
    timestamp: datetime
    risk_assessment: RiskAssessment
    pharmacogenomic_profile: PharmacogenomicProfile
    clinical_recommendation: ClinicalRecommendation
    llm_generated_explanation: LLMGeneratedExplanation
    quality_metrics: QualityMetrics

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    variants_count: int

class GeneProfile(BaseModel):
    gene: str
    diplotype: str
    phenotype: str
    variants_count: int
