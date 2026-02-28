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
                # Using full model name from list_models
                self.model_name = 'models/gemini-2.0-flash'
                self.model = genai.GenerativeModel(self.model_name)
                print(f"🚀 LLMService initialized with model: {self.model_name}")
                logger.info(f"LLMService initialized with {self.model_name}")
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
                import traceback
                traceback.print_exc()
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
                You are PharmaGuard AI, an elite clinical pharmacogenomics assistant. 
                Your goal is to provide high-precision, evidence-based genomic insights.
                
                Guidelines for your responses:
                1. Reference CPIC (Clinical Pharmacogenetics Implementation Consortium) and DPWG (Dutch Pharmacogenetics Working Group) standards.
                2. Explain the relationship between genotypes, phenotypes (e.g., Poor Metabolizer), and clinical outcomes.
                3. Be professional, clinical, and cautious. Always remind users to consult with a MD for actual medical decisions.
                4. If context is provided, prioritize it. Use the patient's specific LFT (Liver Function Tests), KFT (Kidney Function Tests), and clinical scores (GAD-7, PHQ-9) to tailor your advice.
                5. If a query is unrelated to healthcare, medicine, or genomics, politely decline.
                """

                if context:
                    system_prompt += f"\n\nContext - Patient Analysis Results:\n{json.dumps(context, indent=2)}\n"
                    system_prompt += "Use this analysis data to answer specific questions about the patient's risk profile."

                prompt = f"{system_prompt}\n\nUser Query: {message}"
                
                response = self.model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                import traceback
                traceback.print_exc()
                error_msg = str(e)
                if "429" in error_msg:
                    return "I'm sorry, because this is a free-tier API key, the quota for today has been reached. Please try again later or check your Google Gemini quota settings."
                logger.error(f"Error calling LLM for chat: {e}")
                return "PharmaGuard AI service is temporarily overloaded. Please try again in a few moments."
        else:
            return "AI service is currently unavailable. Please check your GEMINI_API_KEY configuration."

    def analyze_pill_image(self, image_data: bytes, mime_type: str = "image/jpeg") -> list[dict]:
        """
        Analyzes a pill image using Gemini Vision to extract drug names and assess risk.
        """
        if not self.model:
            logger.error("Model not initialized. Cannot analyze image.")
            return [{
                "id": 888,
                "name": "Model Not Initialized",
                "status": "Check API Key",
                "color": "bg-gray-500",
                "textColor": "text-gray-700",
                "bgLight": "bg-gray-50"
            }]

        try:
            prompt = """
            You are a pharmaceutical clinical AI assistant. Analyze this image of a medication or pill bottle.
            Identify any drugs present based on the packaging text (OCR) or pill characteristics.
            
            Return a JSON array of identified drugs with these EXACT keys for each drug:
            - id: a unique integer ID
            - name: the identified drug name (e.g., "Atorvastatin (Lipitor)")
            - status: a short status string based on general knowledge (e.g., "Safe — No risk detected", "Adjust Dosage — Caution", "Toxic — Dangerous")
            - color: a tailwind background color class corresponding to the status (e.g., "bg-green-500", "bg-yellow-500", "bg-red-500")
            - textColor: a tailwind text color class for the badge (e.g., "text-green-700", "text-yellow-700", "text-red-700")
            - bgLight: a tailwind background color class for the badge (e.g., "bg-green-50", "bg-yellow-50", "bg-red-50")
            
            Return ONLY the valid JSON array without any markdown formatting.
            """
            
            image_part = {
                "mime_type": mime_type,
                "data": image_data
            }
            
            print("Sending request to Gemini...")
            response = self.model.generate_content([prompt, image_part])
            text = response.text.strip()
            print("=== GEMINI RAW RESPONSE ===")
            print(text)
            print("===========================")
            
            if not text:
               return [{
                    "id": 777,
                    "name": "Empty Response",
                    "status": "AI Found Nothing",
                    "color": "bg-gray-500",
                    "textColor": "text-gray-700",
                    "bgLight": "bg-gray-50"
                }]
            
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            text = text.strip()
                
            data = json.loads(text)
            print("Parsed JSON data:", type(data), data)
            if isinstance(data, list):
                return data
            # If it returned a dict with a key that contains the list
            if isinstance(data, dict):
                for key, value in data.items():
                    if isinstance(value, list):
                        return value
            return []
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            error_msg = str(e).lower()
            logger.error(f"Error analyzing pill image: {e}")
            
            # If the user hit the Gemini free-tier quota, display a fake "drug" warning on the frontend.
            if "429" in error_msg or "quota" in error_msg or "exhausted" in error_msg:
                return [{
                    "id": 999,
                    "name": "API Quota Exceeded",
                    "status": "Service Unavailable",
                    "color": "bg-orange-500",
                    "textColor": "text-orange-700",
                    "bgLight": "bg-orange-50"
                }]
                
            return [{
                "id": 500,
                "name": "Server Error",
                "status": str(e)[:30],
                "color": "bg-red-500",
                "textColor": "text-red-700",
                "bgLight": "bg-red-50"
            }]
