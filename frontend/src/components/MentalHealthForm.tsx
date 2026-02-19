"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Loader2, Save, BrainCircuit, UserCheck } from "lucide-react";

export function MentalHealthForm({ onSave }: { onSave: () => void }) {
    const [loading, setLoading] = useState(false);

    // Mental Health Scores
    const [gad7, setGad7] = useState("");
    const [phq9, setPhq9] = useState("");
    const [stress, setStress] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Fetch existing clinical data to merge, or create new object structure
        // For this demo, we assume we are patching or sending a partial update if the API supported it.
        // But our simple API expects a full object. So ideally we'd fetch first.
        // For simplicity in this demo, we'll just send these fields and mock the rest or handle it in backend.
        // Actually, let's just create a new record with these values and empty others for now, 
        // as the backend doesn't enforce non-null for others.

        const mentalHealthData = {
            patient_id: "demo-patient-001",
            gad7_score: parseInt(gad7) || 0,
            phq9_score: parseInt(phq9) || 0,
            stress_level: parseInt(stress) || 0,
            // Send empty/defaults for others to avoid validation error if any mandatory fields exist (none currently)
            lft: {}, kft: {}, lipid_profile: {}
        };

        try {
            await api.saveClinicalData(mentalHealthData);
            onSave();
            alert("Mental Health Assessment Saved!");
        } catch (error) {
            console.error(error);
            alert("Failed to save assessment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-[#1e293b] border-gray-800 shadow-sm h-full">
            <CardHeader className="border-b border-gray-800 pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-purple-400" />
                    Behavioral Health Assessment
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-4">
                        <InputGroup
                            label="GAD-7 Score (Anxiety)"
                            desc="0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15+: Severe"
                            value={gad7}
                            onChange={setGad7}
                            max={21}
                        />
                        <InputGroup
                            label="PHQ-9 Score (Depression)"
                            desc="0-4: None, 5-9: Mild, 10-14: Moderate, 15+: Severe"
                            value={phq9}
                            onChange={setPhq9}
                            max={27}
                        />
                        <InputGroup
                            label="Stress Level (1-10)"
                            desc="Self-reported current stress"
                            value={stress}
                            onChange={setStress}
                            max={10}
                        />
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Update Assessment
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function InputGroup({ label, desc, value, onChange, max }: { label: string, desc: string, value: string, onChange: (v: string) => void, max: number }) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-200">{label}</label>
                <span className="text-xs text-gray-500">Max: {max}</span>
            </div>
            <input
                type="number"
                min="0"
                max={max}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0"
            />
            <p className="text-[10px] text-gray-500 mt-1">{desc}</p>
        </div>
    )
}
