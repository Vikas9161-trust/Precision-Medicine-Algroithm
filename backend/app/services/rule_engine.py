import json
import os
from typing import Dict, Optional
from sqlmodel import Session, select
from app.core.database import engine
from app.models.pgx_models import DrugGeneInteraction

class RuleEngine:
    def __init__(self, rules_path: str = "app/core/cpic_rules.json"):
        # adjustments: make path relative to where app runs usually (backend root)
        # Verify path existence
        if not os.path.exists(rules_path):
             # Try absolute path based on current file location if relative fails
            current_dir = os.path.dirname(os.path.abspath(__file__))
            rules_path = os.path.join(current_dir, "..", "core", "cpic_rules.json")
            
        self.rules = self._load_rules(rules_path)

    def _load_rules(self, path: str) -> Dict:
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # print(f"Warning: CPIC rules file not found at {path}")
            return {}
        except json.JSONDecodeError:
            # print(f"Error: Invalid JSON in CPIC rules file at {path}")
            return {}

    def get_drug_risk(self, gene: str, phenotype: str, drug: str) -> Optional[Dict]:
        """
        Determines risk and recommendation for a specific drug based on gene and phenotype.
        """
        # 1. Check Database First
        with Session(engine) as session:
            # Case insensitive search for drug
            # In SQLModel/SQLite, default collation might be case insensitive or not depending on OS/setup
            # For robustness, we can try exact match or iterate. 
            # Given we control seeding, let's try exact match first then capital.
            
            stmt = select(DrugGeneInteraction).where(
                DrugGeneInteraction.gene == gene,
                DrugGeneInteraction.phenotype == phenotype,
                DrugGeneInteraction.drug == drug.capitalize() # Try Capitalized first as in seed
            )
            interaction = session.exec(stmt).first()
            
            if not interaction:
                 # Try uppercase
                stmt = select(DrugGeneInteraction).where(
                    DrugGeneInteraction.gene == gene,
                    DrugGeneInteraction.phenotype == phenotype,
                    DrugGeneInteraction.drug == drug.upper()
                )
                interaction = session.exec(stmt).first()

            if interaction:
                return {
                    "risk": interaction.risk_category,
                    "recommendation": interaction.recommendation,
                    "evidence_level": interaction.evidence_level
                }

        # 2. Fallback to JSON Rules
        gene_rules = self.rules.get(gene)
        if not gene_rules:
            return None
        
        # Phenotype keys in JSON map to recommendations
        phenotype_rules = gene_rules.get(phenotype)
        if not phenotype_rules:
             # Check for "Normal" synonyms if direct match fails
            if phenotype in ["Normal Metabolizer", "Normal Function"]:
                 return {"risk": "Safe", "recommendation": "Standard dosing guidelines apply."}
            return {"risk": "Unknown", "recommendation": "No specific CPIC guideline found for this phenotype."}
        
        drug_upper = drug.upper()
        drug_recommendation = phenotype_rules.get(drug_upper)
        
        if not drug_recommendation:
             # If drug not in JSON map but phenotype is normal?
             if "Normal" in phenotype:
                  return {"risk": "Safe", "recommendation": "Standard dosing guidelines apply."}
             return None # allow caller to handle "unknown"
        
        return drug_recommendation
