'use client';

import React, { useState } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MentalHealthForm } from "@/components/MentalHealthForm";
import { AppointmentScheduler } from "@/components/AppointmentScheduler";
import { Brain, ShieldCheck, Activity, AlertTriangle, FileText, Upload, Loader2, Zap, BrainCircuit } from "lucide-react";

export default function PreventiveInsights() {
    const [profile, setProfile] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Derived stats
    const highRiskCount = profile.filter(g => g.phenotype.includes('Poor') || g.phenotype.includes('Ultrarapid')).length;
    const moderateRiskCount = profile.filter(g => g.phenotype.includes('Intermediate')).length;
    const safeCount = profile.filter(g => g.phenotype.includes('Normal')).length;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const data = await api.getProfile(file);
            setProfile(data);
        } catch (error) {
            console.error(error);
            alert("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">

                {/* Hero / Vision Section */}
                <div className="space-y-4 text-center md:text-left">
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        Preventive & Behavioral Insights
                    </h1>
                    <Card className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-indigo-900/50 shadow-md">
                        <CardContent className="pt-6">
                            <p className="text-lg text-gray-300 leading-relaxed font-medium">
                                PharmaGuard extends beyond reactive drug risk prediction by integrating preventive and behavioral pharmacogenomic insights.
                                By analyzing genotype patterns associated with neuropsychiatric drug response and adverse reaction variability, the platform enables
                                proactive risk management and long-term therapeutic optimization.
                            </p>
                            <p className="mt-4 text-gray-400">
                                This approach supports clinicians in anticipating potential side effects, adjusting treatment strategies early, and improving patient safety
                                through personalized, forward-looking precision medicine.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Upload Section */}
                {profile.length === 0 && (
                    <div className="flex justify-center py-12">
                        <div className="flex flex-col items-center gap-4 p-8 bg-[#1e293b] rounded-xl shadow-lg border border-dashed border-gray-700 hover:border-blue-400 transition-colors cursor-pointer w-full max-w-md">
                            {loading ? (
                                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                            ) : (
                                <Upload className="h-12 w-12 text-gray-500" />
                            )}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-white">Upload Patient VCF</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Analyze genomic data to unlock preventive insights.
                                </p>
                            </div>
                            <label className="mt-2">
                                <span className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 transition cursor-pointer select-none">
                                    {loading ? 'Analyzing Genomics...' : 'Select File'}
                                </span>
                                <input type="file" accept=".vcf" className="hidden" onChange={handleFileUpload} disabled={loading} />
                            </label>
                        </div>
                    </div>
                )}

                {/* Dashboard */}
                {profile.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-700">

                        {/* Risk Overview */}
                        <Card className="border-t-4 border-t-blue-600 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Activity className="text-blue-600 h-5 w-5" />
                                    Risk Profiling Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                                        <div className="text-3xl font-bold text-red-600">{highRiskCount}</div>
                                        <div className="text-xs font-semibold text-red-700 uppercase tracking-wide mt-1">High Risk</div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center">
                                        <div className="text-3xl font-bold text-yellow-600">{moderateRiskCount}</div>
                                        <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mt-1">Caution</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                                        <div className="text-3xl font-bold text-green-600">{safeCount}</div>
                                        <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mt-1">Normal</div>
                                    </div>
                                </div>
                                <h4 className="font-semibold text-sm text-slate-500 mb-3 uppercase tracking-wider">Metabolic Activity Map</h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {profile.map((gene, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm group">
                                            <span className="font-mono font-medium text-slate-700 w-16">{gene.gene}</span>
                                            <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${gene.phenotype.includes('Poor') ? 'bg-red-500 w-[20%]' :
                                                        gene.phenotype.includes('Intermediate') ? 'bg-yellow-500 w-[50%]' :
                                                            gene.phenotype.includes('Rapid') ? 'bg-purple-500 w-[90%]' :
                                                                'bg-green-500 w-[60%]'
                                                        }`}
                                                ></div>
                                            </div>
                                            <Badge variant="outline" className={`w-28 justify-center ${gene.phenotype.includes('Poor') ? 'border-red-200 text-red-700 bg-red-50' :
                                                gene.phenotype.includes('Intermediate') ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                                                    gene.phenotype.includes('Rapid') ? 'border-purple-200 text-purple-700 bg-purple-50' :
                                                        'border-green-200 text-green-700 bg-green-50'
                                                }`}>
                                                {gene.phenotype.replace(' Metabolizer', '')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Neuro-PGx Insights */}
                        <div className="space-y-6">
                            <Card className="border-t-4 border-t-purple-600 shadow-md hover:shadow-lg transition-shadow bg-[#1e293b] border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl text-purple-400">
                                        <Brain className="h-6 w-6" />
                                        Neuropsychiatric Panel
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Proactive screening for antidepressant & antipsychotic response.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Example Logic: SSRI Response */}
                                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-200">SSRI Response (Paroxetine)</h4>
                                            {profile.find(p => p.gene === 'CYP2D6' && p.phenotype.includes('Poor')) ? (
                                                <Badge variant="destructive">Avoid / High Risk</Badge>
                                            ) : (
                                                <Badge className="bg-green-600 hover:bg-green-700">Likely Normal</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            CYP2D6 status is a critical predictor for Paroxetine exposure.
                                            {profile.find(p => p.gene === 'CYP2D6' && p.phenotype.includes('Poor'))
                                                ? " Poor metabolizer status indicates significantly increased risk of side effects due to elevated drug plasma levels."
                                                : " Current profile suggests standard metabolic clearance."
                                            }
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-200">Citalopram / Escitalopram</h4>
                                            {profile.find(p => p.gene === 'CYP2C19' && (p.phenotype.includes('Rapid') || p.phenotype.includes('Ultra'))) ? (
                                                <Badge className="bg-yellow-500 hover:bg-yellow-600">Dose Adjustment Needed</Badge>
                                            ) : (
                                                <Badge className="bg-green-600 hover:bg-green-700">Likely Normal</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            CYP2C19 mediates the metabolism of these SSRIs.
                                            {profile.find(p => p.gene === 'CYP2C19' && (p.phenotype.includes('Rapid') || p.phenotype.includes('Ultra')))
                                                ? " Rapid metabolizer status may lead to sub-therapeutic levels and treatment failure."
                                                : " Standard dosing likely appropriate based on genotype."
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-t-4 border-t-orange-500 shadow-md bg-[#1e293b] border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl text-orange-400">
                                        <ShieldCheck className="h-5 w-5" />
                                        Behavioral & Addiction Risk
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start gap-4 p-3 bg-orange-900/20 rounded-lg text-orange-400">
                                        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-semibold mb-1">Opioid Sensitivity (OPRM1)</p>
                                            <p className="text-orange-300">Gene variant not detected in current VCF panel. Standard monitoring protocols for opioid analgesics are recommended until further specific testing is performed.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
                {/* Mental Health & Behavioral Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <div className="md:col-span-1">
                        <MentalHealthForm onSave={() => window.location.reload()} />
                    </div>

                    <div className="md:col-span-2">
                        <Card className="h-full border-t-4 border-t-purple-500 shadow-md bg-[#1e293b] border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-purple-400">
                                    <BrainCircuit className="h-5 w-5" />
                                    Neuro-Behavioral Risk Analysis
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Correlation of genetic markers with behavioral health scores.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="p-4 bg-purple-900/10 rounded-lg border border-purple-900/20">
                                        <h4 className="font-semibold text-purple-300 mb-2">Depression Management (SSRI Response)</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-800 p-3 rounded text-center min-w-[100px]">
                                                <div className="text-xs text-gray-400">Genotype</div>
                                                <div className="font-mono text-white text-lg">CYP2C19</div>
                                                <div className="text-xs text-yellow-500 font-bold">*1/*2 (IM)</div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-300">
                                                    Intermediate Metabolizer status suggests <span className="text-yellow-400 font-medium">slower clearance</span> of Sertraline/Escitalopram.
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    If PHQ-9 score is high ({'>'}10), consider starting at 50% standard dose to avoid side effects.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                            <h5 className="text-sm font-medium text-gray-300 mb-1">Anxiety Risk (GAD-7)</h5>
                                            <div className="flex items-end gap-2">
                                                <span className="text-2xl font-bold text-white">Pending</span>
                                                <span className="text-xs text-gray-500 mb-1">/ 21</span>
                                            </div>
                                            <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
                                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                            <h5 className="text-sm font-medium text-gray-300 mb-1">Stress & Cortisol Response</h5>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="border-orange-500 text-orange-400">FKBP5 Variant Detected</Badge>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Carriers may have prolonged stress response. Mindfulness interventions recommended.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Youth Addiction & Pharmacogenomic Risk Awareness */}
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-indigo-500/30 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <ShieldCheck className="w-64 h-64 text-indigo-500" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl text-white">
                                <Zap className="h-8 w-8 text-yellow-500" />
                                Youth Addiction & Pharmacogenomic Risk Awareness
                            </CardTitle>
                            <CardDescription className="text-gray-300 max-w-3xl text-base">
                                Substance misuse and prescription drug addiction among youth are growing public health concerns.
                                Pharmacogenomic insights can identify individuals susceptible to adverse reactions, altered drug sensitivity, or dependency risks.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {/* Opioids */}
                            <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-700/50 hover:border-red-500/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-500/20 rounded-lg text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Opioids & Dependency</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    Genetic variations in <strong>OPRM1</strong> and <strong>CYP2D6</strong> can influence opioid reward processing and metabolism, potentially increasing the risk of euphoria-driven dependency or overdose.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="text-red-500 mt-0.5">•</span>
                                        <span>Altered dopamine response in reward pathways.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="text-red-500 mt-0.5">•</span>
                                        <span>Risk of respiratory depression in Ultra-Rapid Metabolizers.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Stimulants */}
                            <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Stimulants (ADHD)</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    Genes like <strong>COMT</strong> and <strong>ADRA2A</strong> affect how stimulants (e.g., Adderall, Ritalin) are processed. Mismatched dosing can lead to anxiety, agitation, or increased potential for misuse.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="text-orange-500 mt-0.5">•</span>
                                        <span>Inadequate therapeutic response leading to self-medication.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="text-orange-500 mt-0.5">•</span>
                                        <span>Heightened side effects mimicking anxiety disorders.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Psychoactive & Behavioral */}
                            <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Brain className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Psychoactive Drugs</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    Targeted analysis of <strong>CYP2C19</strong> and <strong>CYP2D6</strong> ensures safe prescribing of antidepressants and anxiolytics, preventing adverse neurological reactions in developing brains.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="text-purple-500 mt-0.5">•</span>
                                        <span>Avoidance of "trial-and-error" prescribing.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="text-purple-500 mt-0.5">•</span>
                                        <span>Early identification of gene-drug interactions.</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
