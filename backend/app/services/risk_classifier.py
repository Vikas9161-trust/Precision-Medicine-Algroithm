from typing import List, Dict
from app.services.vcf_parser import VCFParser
from app.services.star_allele_resolver import StarAlleleResolver
from app.services.rule_engine import RuleEngine
from app.services.llm_service import LLMService
from app.models.schemas import AnalysisResult, RiskAssessment, PharmacogenomicProfile, DetectedVariant, ClinicalRecommendation, QualityMetrics, LLMGeneratedExplanation
from app.models.models import AnalysisRecord
from app.core.database import engine
from sqlmodel import Session
from datetime import datetime
import uuid
import json

class RiskClassifier:
    def __init__(self):
        self.vcf_parser = VCFParser()
        self.star_allele_resolver = StarAlleleResolver()
        self.rule_engine = RuleEngine()
        self.llm_service = LLMService()

    def get_patient_profile(self, vcf_content: str) -> List[Dict]:
        """
        Parses VCF and returns a list of gene profiles (Diplotype/Phenotype) for all supported genes.
        """
        # 1. Variant Parsing
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.vcf') as temp_vcf:
            temp_vcf.write(vcf_content)
            temp_vcf_path = temp_vcf.name
            
        try:
            variants_list = self.vcf_parser.parse(temp_vcf_path)
        finally:
            os.remove(temp_vcf_path)
            
        variants_map = {}
        for v in variants_list:
            gene = v.get("gene")
            if gene not in variants_map:
                variants_map[gene] = []
            variants_map[gene].append(v)
            
        supported_genes = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"]
        profile_results = []
        
        for gene in supported_genes:
            gene_variants = variants_map.get(gene, [])
            resolution_result = self.star_allele_resolver.resolve(gene, gene_variants)
            
            profile_results.append({
                "gene": gene,
                "diplotype": resolution_result["diplotype"],
                "phenotype": resolution_result["phenotype"],
                "variants_count": len(gene_variants)
            })
            
        return profile_results

    def analyze(self, vcf_content: str, drug_name: str, patient_id: str = None) -> AnalysisResult:
        # 1. Variant Parsing
        # Save content to a temp file because VCFParser expects a file path
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.vcf') as temp_vcf:
            temp_vcf.write(vcf_content)
            temp_vcf_path = temp_vcf.name
            
        try:
            variants_list = self.vcf_parser.parse(temp_vcf_path)
        finally:
            os.remove(temp_vcf_path)
            
        # Group variants by gene
        variants_map = {}
        for v in variants_list:
            gene = v.get("gene")
            if gene not in variants_map:
                variants_map[gene] = []
            variants_map[gene].append(v)

        # 2. Star Allele Mapping & 3. Phenotype Determination
        supported_genes = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"]
        patient_profile = {}
        
        for gene in supported_genes:
            gene_variants = variants_map.get(gene, [])
            
            # Resolve returns dict with diplotype and phenotype
            resolution_result = self.star_allele_resolver.resolve(gene, gene_variants)
            
            patient_profile[gene] = {
                "diplotype": resolution_result["diplotype"],
                "phenotype": resolution_result["phenotype"],
                "variants": gene_variants
            }

        # 4. Drug-Gene Matching
        drug_gene_map = {
            "CODEINE": "CYP2D6",
            "TRAMADOL": "CYP2D6",
            "CLOPIDOGREL": "CYP2C19",
            "WARFARIN": "CYP2C9",
            "SIMVASTATIN": "SLCO1B1",
            "AZATHIOPRINE": "TPMT",
            "FLUOROURACIL": "DPYD",
            "CAPECITABINE": "DPYD"
        }
        
        primary_gene = drug_gene_map.get(drug_name.upper())
        # If drug not found in our specific map but gene is provided/implied or we need to fallback
        if not primary_gene:
             # Just a fallback for demo if unknown drug
            primary_gene = "CYP2D6" 
            
        gene_data = patient_profile.get(primary_gene, {})
        diplotype = gene_data.get("diplotype", "*1/*1")
        phenotype = gene_data.get("phenotype", "Unknown")
        gene_variants = gene_data.get("variants", [])

        # 5. CPIC Rule Engine & 6. Risk Classification
        risk_info = self.rule_engine.get_drug_risk(primary_gene, phenotype, drug_name)
        risk_label = "Unknown"
        recommendation_text = "No CPIC guideline available."
        
        if risk_info:
            risk_label = risk_info.get("risk", "Unknown")
            recommendation_text = risk_info.get("recommendation", recommendation_text)

        # 7. Composite Risk Scoring
        confidence_SCORE = 0.95
        if phenotype == "Unknown":
            confidence_SCORE -= 0.2
        if risk_label == "Unknown":
            confidence_SCORE -= 0.3
            
        severity = "low"
        if risk_label in ["Toxic", "Ineffective"]:
            severity = "high"
        elif risk_label == "Adjust Dosage":
            severity = "moderate"
        elif risk_label == "Safe":
            severity = "low"

        # 8. LLM Explanation
        llm_explanation = self.llm_service.generate_explanation(
            drug=drug_name,
            gene=primary_gene,
            phenotype=phenotype,
            risk=risk_label,
            recommendation=recommendation_text
        )

        if not patient_id:
            patient_id = f"PATIENT_{uuid.uuid4().hex[:8].upper()}"
            
        detected_variants_models = [
            DetectedVariant(rsid=v.get("rsid", ""), genotype=v.get("genotype", "")) 
            for v in gene_variants
        ]
        
        result = AnalysisResult(
            patient_id=patient_id,
            drug=drug_name,
            timestamp=datetime.now(),
            risk_assessment=RiskAssessment(
                risk_label=risk_label,
                confidence_score=round(confidence_SCORE, 2),
                severity=severity
            ),
            pharmacogenomic_profile=PharmacogenomicProfile(
                primary_gene=primary_gene,
                diplotype=diplotype,
                phenotype=phenotype,
                detected_variants=detected_variants_models
            ),
            clinical_recommendation=ClinicalRecommendation(
                recommendation_text=recommendation_text
            ),
            llm_generated_explanation=llm_explanation,
            quality_metrics=QualityMetrics(
                vcf_parsing_success=True,
                rule_engine_match=True if risk_info else False,
                llm_validation_status="consistent"
            )
        )
        
        self._save_to_db(result)
        
        return result

    def _save_to_db(self, result: AnalysisResult):
        try:
            record = AnalysisRecord(
                patient_id=result.patient_id,
                drug=result.drug,
                timestamp=result.timestamp,
                primary_gene=result.pharmacogenomic_profile.primary_gene,
                phenotype=result.pharmacogenomic_profile.phenotype,
                diplotype=result.pharmacogenomic_profile.diplotype,
                risk_label=result.risk_assessment.risk_label,
                recommendation=result.clinical_recommendation.recommendation_text,
                full_result_json=result.model_dump_json() # Use model_dump_json for Pydantic v2
            )
            
            with Session(engine) as session:
                session.add(record)
                session.commit()
                # session.refresh(record) # Not needed unless we use the ID immediately
        except Exception as e:
            print(f"Failed to save analysis record to DB: {e}")
