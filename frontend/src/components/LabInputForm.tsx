"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Loader2, Save, Activity } from "lucide-react";

export function LabInputForm({ onSave }: { onSave: () => void }) {
    const [loading, setLoading] = useState(false);

    // Lab Values State
    const [lft, setLft] = useState({ alt: "", ast: "", alp: "", bilirubin: "" });
    const [kft, setKft] = useState({ creatinine: "", egfr: "", bun: "" });
    const [hba1c, setHba1c] = useState("");
    const [lipids, setLipids] = useState({ cholesterol: "", ldl: "", hdl: "", triglycerides: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const clinicalData = {
            patient_id: "demo-patient-001", // Hardcoded for demo
            lft: {
                alt: parseFloat(lft.alt) || 0,
                ast: parseFloat(lft.ast) || 0,
                alp: parseFloat(lft.alp) || 0,
                bilirubin: parseFloat(lft.bilirubin) || 0
            },
            kft: {
                creatinine: parseFloat(kft.creatinine) || 0,
                egfr: parseFloat(kft.egfr) || 0,
                bun: parseFloat(kft.bun) || 0
            },
            hba1c: parseFloat(hba1c) || 0,
            lipid_profile: {
                cholesterol: parseFloat(lipids.cholesterol) || 0,
                ldl: parseFloat(lipids.ldl) || 0,
                hdl: parseFloat(lipids.hdl) || 0,
                triglycerides: parseFloat(lipids.triglycerides) || 0
            }
        };

        try {
            await api.saveClinicalData(clinicalData);
            onSave(); // Refresh parent
            alert("Clinical Data Saved Successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-[#1e293b] border-gray-800 shadow-sm">
            <CardHeader className="border-b border-gray-800 pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Enter Clinical Lab Values
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Liver Function */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Liver Function (LFT)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InputGroup label="ALT (U/L)" value={lft.alt} onChange={v => setLft({ ...lft, alt: v })} />
                            <InputGroup label="AST (U/L)" value={lft.ast} onChange={v => setLft({ ...lft, ast: v })} />
                            <InputGroup label="ALP (U/L)" value={lft.alp} onChange={v => setLft({ ...lft, alp: v })} />
                            <InputGroup label="Bilirubin" value={lft.bilirubin} onChange={v => setLft({ ...lft, bilirubin: v })} />
                        </div>
                    </div>

                    {/* Kidney Function */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider">Kidney Function (KFT)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <InputGroup label="Creatinine" value={kft.creatinine} onChange={v => setKft({ ...kft, creatinine: v })} />
                            <InputGroup label="eGFR" value={kft.egfr} onChange={v => setKft({ ...kft, egfr: v })} />
                            <InputGroup label="BUN" value={kft.bun} onChange={v => setKft({ ...kft, bun: v })} />
                        </div>
                    </div>

                    {/* Metabolic & Lipids */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Metabolic & Lipids</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <InputGroup label="HbA1c (%)" value={hba1c} onChange={setHba1c} />
                            <InputGroup label="Cholesterol" value={lipids.cholesterol} onChange={v => setLipids({ ...lipids, cholesterol: v })} />
                            <InputGroup label="LDL" value={lipids.ldl} onChange={v => setLipids({ ...lipids, ldl: v })} />
                            <InputGroup label="HDL" value={lipids.hdl} onChange={v => setLipids({ ...lipids, hdl: v })} />
                            <InputGroup label="Triglycerides" value={lipids.triglycerides} onChange={v => setLipids({ ...lipids, triglycerides: v })} />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Clinical Data
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function InputGroup({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
            <input
                type="number"
                step="0.1"
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0.0"
            />
        </div>
    )
}
