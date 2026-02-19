from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_cyp2d6_pm():
    # Mock VCF content for CYP2D6 *4/*4 (Poor Metabolizer)
    # rs3892097 G>A is *4. Homozygous A/A means *4/*4.
    vcf_content = """##fileformat=VCFv4.2
##source=Test
#CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
22 42522613 rs3892097 G A . . . GT 1/1
"""
    
    files = {"file": ("test.vcf", vcf_content, "text/plain")}
    data = {"drug": "Codeine"}
    
    response = client.post("/analyze", files=files, data=data)
    
    assert response.status_code == 200
    result = response.json()
    
    # Verify Structure
    assert "pharmacogenomic_profile" in result
    assert "risk_assessment" in result
    assert "clinical_recommendation" in result
    
    # Verify Content
    pgx = result["pharmacogenomic_profile"]
    risk = result["risk_assessment"]
    
    assert pgx["primary_gene"] == "CYP2D6"
    assert pgx["phenotype"] == "Poor Metabolizer"
    # Diplotype order might vary *4/*4
    assert "*4" in pgx["diplotype"]
    
    assert risk["risk_label"] == "Ineffective"
    assert "Avoid codeine" in result["clinical_recommendation"]["recommendation_text"]

def test_analyze_cyp2c19_im_clopidogrel():
    # CYP2C19 *1/*2 (IM) -> *2 is rs4244285 G>A
    vcf_content = """##fileformat=VCFv4.2
#CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
10 96522463 rs4244285 G A . . . GT 0/1
"""
    files = {"file": ("test.vcf", vcf_content, "text/plain")}
    data = {"drug": "Clopidogrel"}
    
    response = client.post("/analyze", files=files, data=data)
    
    assert response.status_code == 200
    result = response.json()
    
    pgx = result["pharmacogenomic_profile"]
    risk = result["risk_assessment"]
    
    assert pgx["primary_gene"] == "CYP2C19"
    assert pgx["phenotype"] == "Intermediate Metabolizer"
    assert risk["risk_label"] == "Adjust Dosage"

def test_analyze_unknown_drug():
    vcf_content = """##fileformat=VCFv4.2
#CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
"""
    files = {"file": ("test.vcf", vcf_content, "text/plain")}
    data = {"drug": "UnknownDrug"}
    
    response = client.post("/analyze", files=files, data=data)
    
    assert response.status_code == 200
    result = response.json()
    
    # Should fallback to CYP2D6 and Unknown risk
    assert result["pharmacogenomic_profile"]["primary_gene"] == "CYP2D6"
    assert result["risk_assessment"]["risk_label"] == "Unknown"
