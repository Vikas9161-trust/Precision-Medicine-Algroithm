from app.models.schemas import LLMGeneratedExplanation
import google.generativeai as genai
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") # Ensure .env is loaded
        self.model = None
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro')
                logger.info("LLMService initialized with Gemini Pro")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
        else:
            logger.warning("GEMINI_API_KEY not found. Using template fallback.")

    def generate_explanation(self, drug: str, gene: str, phenotype: str, risk: str, recommendation: str) -> LLMGeneratedExplanation:
        """
        Generates a clinical explanation using Gemini Pro if available, otherwise falls back to template.
        """
        if self.model:
            try:
                return self._generate_ai_explanation(drug, gene, phenotype, risk, recommendation)
            except Exception as e:
                logger.error(f"Error calling LLM: {e}. Falling back to template.")
                
        return self._generate_template_explanation(drug, gene, phenotype, risk, recommendation)

    def _generate_ai_explanation(self, drug: str, gene: str, phenotype: str, risk: str, recommendation: str) -> LLMGeneratedExplanation:
        prompt = f"""
        Act as an expert Clinical Pharmacologist specializing in Pharmacogenomics.
        
        Analyze the following patient result:
        - Drug: {drug}
        - Gene: {gene}
        - Patient Phenotype: {phenotype}
        - Predicted CPIC Risk: {risk}
        - Guideline Recommendation: {recommendation}

        Provide a structured clinical explanation in JSON format with the following keys:
        - summary: A concise 1-sentence summary of the finding.
        - mechanism: Explain the biological mechanism of how this gene/phenotype affects this drug (2 sentences max).
        - clinical_interpretation: A detailed interpretation for the clinician, explaining the implications for efficacy and toxicity (3-4 sentences).

        Return ONLY the JSON. Do not include markdown formatting.
        """
        
        response = self.model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean up if model returns markdown blocks
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        data = json.loads(text)
        
        return LLMGeneratedExplanation(
            summary=data.get("summary", ""),
            mechanism=data.get("mechanism", ""),
            clinical_interpretation=data.get("clinical_interpretation", "")
        )

    def _generate_template_explanation(self, drug: str, gene: str, phenotype: str, risk: str, recommendation: str) -> LLMGeneratedExplanation:
        
        # Determine mechanism explanation based on gene
        mechanisms = {
            "CYP2D6": f"{gene} is a key enzyme responsible for metabolizing approximately 25% of clinically used drugs, including {drug}.",
            "CYP2C19": f"{gene} plays a crucial role in the bioactivation or clearance of drugs like {drug}.",
            "CYP2C9": f"{gene} is involved in the metabolism of drugs with narrow therapeutic indices, such as {drug}.",
            "SLCO1B1": f"{gene} encodes a transporter protein (OATP1B1) that facilitates the uptake of drugs like {drug} into the liver.",
            "TPMT": f"{gene} is essential for the metabolism of thiopurine drugs. Reduced activity can lead to severe toxicity.",
            "DPYD": f"{gene} is responsible for the catabolism of fluoropyrimidines like {drug}. Deficiency can cause life-threatening toxicity."
        }
        
        mech_text = mechanisms.get(gene, f"{gene} is involved in the metabolic pathway of {drug}.")

        # Generate Clinical Interpretation based on Risk
        if risk == "Safe":
            interpretation = f"The patient has a {phenotype} status for {gene}, which is associated with normal drug metabolism. Standard dosing is recommended as efficacy and safety are expected to be comparable to the general population."
        elif risk == "Ineffective":
            interpretation = f"The {phenotype} status suggests reduced conversion of {drug} to its active form, likely resulting in therapeutic failure. Alternative medications should be considered."
        elif risk == "Toxic":
            interpretation = f"Due to the {phenotype} status, the patient is at high risk of elevated drug levels and severe adverse effects. Clinical guidelines strongly advise against using {drug} or recommend a drastic dose reduction."
        elif risk == "Adjust Dosage":
            interpretation = f"The patient's {phenotype} genotype implies altered metabolism. To prevent toxicity or ensure efficacy, a dosage adjustment is recommended according to pharmacogenomic guidelines."
        else:
            interpretation = "Clinical impact is indeterminate based on current guidelines."

        # Summary
        summary = f"Pharmacogenomic analysis of {gene} indicates a '{phenotype}' status. For {drug}, this confers a risk classification of '{risk}'. {recommendation}"

        return LLMGeneratedExplanation(
            summary=summary,
            mechanism=mech_text,
            clinical_interpretation=interpretation
        )

    def chat(self, message: str, context: dict = None) -> str:
        """
        Handles general chat interactions using Gemini Pro with optional clinical context.
        """
        if self.model:
            try:
                # Construct System Prompt with Context
                system_prompt = """
                You are PharmaGuard AI, an expert clinical pharmacogenomics assistant.
                Answer the following query from a user (clinician or patient) accurately and concisely.
                If the query is not related to pharmacogenomics, drugs, or genetics, politely decline.
                """

                if context:
                    system_prompt += f"\n\nContext - Patient Analysis Results:\n{json.dumps(context, indent=2)}\n"
                    system_prompt += "Use this analysis data to answer specific questions about the patient's risk profile."

                prompt = f"{system_prompt}\n\nUser Query: {message}"
                
                response = self.model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                logger.error(f"Error calling LLM for chat: {e}")
                return "I'm currently unable to process your request. Please try again later."
        else:
            return "AI service is currently unavailable. Please check configuration."
