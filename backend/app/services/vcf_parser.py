import os
from typing import List, Dict, Optional

class VCFParser:
    def __init__(self):
        # Target RSIDs for the 6 pharmacogenes
        # In a real app, this would be a comprehensive database
        self.target_rsids = {
            # CYP2D6
            "rs3892097": {"gene": "CYP2D6", "ref": "G", "alt": "A"}, # *4
            "rs1065852": {"gene": "CYP2D6", "ref": "G", "alt": "A"}, # *10
            # CYP2C19
            "rs4244285": {"gene": "CYP2C19", "ref": "G", "alt": "A"}, # *2
            "rs4986893": {"gene": "CYP2C19", "ref": "G", "alt": "A"}, # *3
            # CYP2C9
            "rs1799853": {"gene": "CYP2C9", "ref": "C", "alt": "T"}, # *2
            "rs1057910": {"gene": "CYP2C9", "ref": "A", "alt": "C"}, # *3
            # SLCO1B1
            "rs4149056": {"gene": "SLCO1B1", "ref": "T", "alt": "C"}, # *5
            # TPMT
            "rs1800460": {"gene": "TPMT", "ref": "G", "alt": "A"}, # *3B
            "rs1142345": {"gene": "TPMT", "ref": "T", "alt": "C"}, # *3C
            # DPYD
            "rs3918290": {"gene": "DPYD", "ref": "G", "alt": "A"}, # *2A
        }

    def parse(self, file_path: str) -> List[Dict]:
        """
        Parses a VCF file and extracts target variants.
        """
        extracted_variants = []
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        try:
            with open(file_path, 'r') as f:
                for line in f:
                    if line.startswith("#"):
                        continue
                    
                    parts = line.strip().split("\t")
                    if len(parts) < 10:
                        continue
                        
                    # standard VCF columns: CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
                    rsid = parts[2]
                    
                    if rsid in self.target_rsids:
                        ref = parts[3]
                        alt = parts[4]
                        fmt = parts[8]
                        sample = parts[9]
                        
                        # Parse genotype
                        gt_index = fmt.split(":").index("GT")
                        gt_value = sample.split(":")[gt_index]
                        
                        # Convert 0/0, 0/1, 1/1 to nucleotide representation
                        alleles = [ref] + alt.split(",")
                        genotype_indices = gt_value.replace("|", "/").split("/")
                        
                        try:
                            # Handle missing data '.'
                            if '.' in genotype_indices:
                                genotype_str = "./."
                            else:
                                a1 = alleles[int(genotype_indices[0])]
                                a2 = alleles[int(genotype_indices[1])]
                                genotype_str = f"{a1}/{a2}"
                        except (ValueError, IndexError):
                            genotype_str = "Unknown"

                        extracted_variants.append({
                            "gene": self.target_rsids[rsid]["gene"],
                            "rsid": rsid,
                            "genotype": genotype_str,
                            "ref": ref,
                            "alt": alt
                        })
                        
        except Exception as e:
            print(f"Error parsing VCF: {e}")
            return []

        return extracted_variants
