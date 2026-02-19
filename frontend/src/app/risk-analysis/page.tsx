'use client';
import React, { useState } from 'react';
import { api } from "@/services/api";
import { useRouter } from 'next/navigation';
import { Loader2, Upload } from 'lucide-react';

const DRUG_CASE_STUDIES = [
    {
        drug: "Clopidogrel (Plavix)",
        gene: "CYP2C19",
        category: "Cardiology",
        symptoms: "High risk of stent thrombosis / stroke in Poor Metabolizers.",
        dosage: "Avoid Clopidogrel. Use alternative (e.g., Prasugrel or Ticagrelor).",
        case_study: "Patient with acute coronary syndrome and CYP2C19*2/*2 genotype suffered recurrent ischemia despite standard therapy.",
        chart_label: "Active Metabolite Formation",
        chart_val: 20, // Low %
        chart_color: "bg-red-500"
    },
    {
        drug: "Warfarin",
        gene: "CYP2C9 / VKORC1",
        category: "Anticoagulant",
        symptoms: "High bleeding risk (hemorrhage) in Poor Metabolizers.",
        dosage: "Start with lower dose (e.g., 2-3mg/day). Monitor INR closely.",
        case_study: "Elderly patient with VKORC1 AA genotype developed severe internal bleeding 1 week after standard dose initiation.",
        chart_label: "Bleeding Risk Level",
        chart_val: 90, // High %
        chart_color: "bg-red-600"
    },
    {
        drug: "Codeine",
        gene: "CYP2D6",
        category: "Pain Management",
        symptoms: "Ultra-Rapid Metabolizers convert to Morphine too fast (Respiratory Depression).",
        dosage: "Avoid Codeine. Use non-opioid or non-CYP2D6 metabolized opioid.",
        case_study: "Breastfed infant died of morphine toxicity; mother was CYP2D6 Ultra-Rapid Metabolizer taking standard codeine dose.",
        chart_label: "Toxicity Risk (URM)",
        chart_val: 95,
        chart_color: "bg-purple-500"
    },
    {
        drug: "Simvastatin",
        gene: "SLCO1B1",
        category: "Statins",
        symptoms: "Severe myopathy (muscle pain) or Rhabdomyolysis.",
        dosage: "Limit dose to 20mg/day or switch to Rosuvastatin.",
        case_study: "Patient on 40mg Simvastatin developed disabling muscle weakness; genetic test revealed SLCO1B1*5 carrier.",
        chart_label: "Myopathy Risk",
        chart_val: 75,
        chart_color: "bg-orange-500"
    },
    {
        drug: "Abacavir",
        gene: "HLA-B*57:01",
        category: "Infectious Disease",
        symptoms: "Life-threatening Hypersensitivity Reaction (HSR).",
        dosage: "Contraindicated. Do not prescribe if positive.",
        case_study: "Patient initiated Abacavir without screening developed fever, rash, and respiratory distress within 3 days.",
        chart_label: "Hypersensitivity Probability",
        chart_val: 99,
        chart_color: "bg-red-700"
    },
    {
        drug: "Tamoxifen",
        gene: "CYP2D6",
        category: "Oncology",
        symptoms: "Reduced efficacy (Endoxifen formation) -> Tumor Recurrence.",
        dosage: "Consider Aromatase Inhibitor if CYP2D6 Poor Metabolizer.",
        case_study: "Breast cancer recurrence observed in patients with CYP2D6*4/*4 genotype due to sub-therapeutic active drug levels.",
        chart_label: "Drug Efficacy (PM)",
        chart_val: 15, // Low
        chart_color: "bg-yellow-500"
    }
];

export default function DrugRiskIntelligence() {
    const [drug, setDrug] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAnalyze = async () => {
        if (!drug) {
            setError("Please enter a drug name.");
            return;
        }
        if (!file) {
            setError("Please upload a VCF file.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await api.analyze(file, drug);
            sessionStorage.setItem("analysisResult", JSON.stringify(result));
            router.push("/results");
        } catch (err: any) {
            setError(err.message || "Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-12 bg-[#0a0a0a] min-h-screen font-sans">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white tracking-tight">Drug Risk Intelligence</h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Upload your genomic data to check for life-saving interactions.
                </p>
            </div>

            <div className="bg-[#1e293b] p-8 rounded-2xl shadow-xl border border-gray-800 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Drug Name</label>
                        <input
                            type="text"
                            placeholder="Enter Drug Name (e.g., Warfarin)"
                            className="w-full p-4 bg-gray-900 border border-gray-700 text-white rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 outline-none text-lg placeholder-gray-600"
                            value={drug}
                            onChange={(e) => setDrug(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Genomic Data (VCF)</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".vcf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="vcf-upload-risk"
                            />
                            <label
                                htmlFor="vcf-upload-risk"
                                className={`flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${file ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-800'}`}
                            >
                                <Upload className={`h-6 w-6 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                                <span className={`font-medium ${file ? 'text-green-400' : 'text-gray-400'}`}>
                                    {file ? file.name : "Upload VCF File"}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Analyze Personal Risk"}
                </button>
            </div>

            {/* Supported High-Evidence Targets - Case Studies */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-8 bg-blue-500 rounded-full" />
                        Real-World High Impact Cases
                    </h2>
                    <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">6 Key Targets</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DRUG_CASE_STUDIES.map((item, idx) => (
                        <div key={idx} className="bg-[#1e293b] border border-gray-800 rounded-xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.drug}</h3>
                                    <span className="text-xs font-mono text-blue-300 bg-blue-900/30 px-2 py-1 rounded mt-1 inline-block border border-blue-500/20">{item.gene}</span>
                                </div>
                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded uppercase tracking-wide border border-gray-700">{item.category}</span>
                            </div>

                            {/* Chart Bar */}
                            <div className="mb-6 space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>{item.chart_label}</span>
                                    <span>{item.chart_val > 50 ? 'High' : 'Low'}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.chart_color}`}
                                        style={{ width: `${item.chart_val}%` }}
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="bg-red-900/10 p-3 rounded-lg border border-red-500/10">
                                    <p className="text-xs text-red-300 font-semibold mb-1">⚠️ Symptoms & Risk</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">{item.symptoms}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Recommended Action</p>
                                    <p className="text-sm text-gray-300">{item.dosage}</p>
                                </div>

                                <div className="pt-3 border-t border-gray-800">
                                    <p className="text-xs text-gray-500 italic">"{item.case_study}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
