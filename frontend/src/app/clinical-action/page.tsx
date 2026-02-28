"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Building2, CheckCircle2, Map, ShieldAlert, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DnaModel from "@/components/DnaModel";

export default function ClinicalAction() {
    // Simulated Zone State
    const [zones, setZones] = useState([
        { id: 1, name: 'North Zone', risk: 'Low', color: 'bg-green-500' },
        { id: 2, name: 'South Zone', risk: 'Low', color: 'bg-green-500' },
        { id: 3, name: 'East Zone', risk: 'Medium', color: 'bg-yellow-500' },
        { id: 4, name: 'West Zone', risk: 'Low', color: 'bg-green-500' },
    ]);

    const [alerts, setAlerts] = useState<string[]>([]);
    const [simulating, setSimulating] = useState(false);
    const [ordering, setOrdering] = useState(false);
    const [ordered, setOrdered] = useState(false);

    const simulateRiskEscalation = () => {
        setSimulating(true);
        // Simulate finding a high risk cluster in South Zone
        setTimeout(() => {
            setZones(prev => prev.map(z => z.id === 2 ? { ...z, risk: 'Critical', color: 'bg-red-500' } : z));
            addAlert("⚠️ Critical Drug Risk Detected in South Zone (Metabolic Failure Rate > 15%)");

            // Auto-Notify CSIR & DHPC
            setTimeout(() => {
                addAlert("📡 Automatic Protocol Initiated: Notifying Regulatory Bodies...");
                setTimeout(() => {
                    addAlert("✅ CSIR Notified: Report #CSIR-2024-998 Sent.");
                    addAlert("✅ DHPC Notified: Immediate Action Request #DHPC-URG-001 Sent.");
                    setSimulating(false);
                }, 1500);
            }, 1000);
        }, 1000);
    };

    const addAlert = (msg: string) => {
        setAlerts(prev => [msg, ...prev]);
    };

    const handleOrderPanel = () => {
        setOrdering(true);
        setTimeout(() => {
            setOrdering(false);
            setOrdered(true);
            addAlert("📦 Clinical Order Placed: Genomic Panel (SLCO1B1) sent to Diagnostic Lab.");
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 min-h-screen font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Clinical Action & Economics</h1>
                        <p className="text-gray-400 mt-1">Test recommendations, economic impact, and regulatory compliance.</p>
                    </div>
                    <Button
                        onClick={simulateRiskEscalation}
                        disabled={simulating || !!zones.find(z => z.risk === 'Critical')}
                        variant="destructive"
                        className="shadow-lg shadow-red-900/20"
                    >
                        {simulating ? <Activity className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                        Simulate Outbreak
                    </Button>
                </div>

                {/* 3D DNA Visualization Hero Section */}
                <div className="w-full bg-gradient-to-br from-slate-900 via-black to-slate-900 rounded-xl border border-indigo-500/20 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-4 left-6 z-10 pointer-events-none">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 flex items-center gap-2">
                            Interactive Genetic Engine
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">Live 3D Visualization</p>
                    </div>
                    <div className="h-[400px] w-full">
                        <DnaModel />
                    </div>
                </div>

                {/* Regulatory Reporting Section (NEW) */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-indigo-500/30 shadow-xl overflow-hidden">
                    <CardHeader className="border-b border-indigo-500/10 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-xl text-white">
                                    <ShieldAlert className="h-6 w-6 text-indigo-400" />
                                    Regulatory Surveillance System
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Real-time coordination with <span className="text-indigo-300 font-medium">CSIR</span> (Council of Scientific and Industrial Research) & <span className="text-indigo-300 font-medium">DHPC</span>.
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-green-500 text-green-400 bg-green-950/30">System Active</Badge>
                                <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-950/30">Auto-Reporting On</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Zone Map Visualization */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Map className="h-4 w-4" /> Zone Monitoring
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {zones.map(zone => (
                                    <div key={zone.id} className={`p-4 rounded-lg border ${zone.risk === 'Critical' ? 'border-red-500/50 bg-red-950/20' : 'border-gray-800 bg-gray-900/50'} flex flex-col items-center justify-center gap-2 transition-all duration-500`}>
                                        <div className={`w-3 h-3 rounded-full ${zone.color} shadow-[0_0_10px_currentColor] animate-pulse`} />
                                        <span className="text-gray-200 font-medium">{zone.name}</span>
                                        <Badge variant={zone.risk === 'Critical' ? 'destructive' : 'secondary'} className="text-xs">
                                            {zone.risk} Risk
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Alert Log */}
                        <div className="bg-black/40 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
                            <div className="p-3 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
                                <span className="text-xs font-mono text-gray-400 flex items-center gap-2">
                                    <Bell className="h-3 w-3" /> Live Event Log
                                </span>
                                {alerts.length > 0 && <span className="text-[10px] text-green-500 animate-pulse">● Live Updates</span>}
                            </div>
                            <div className="p-4 space-y-3 font-mono text-sm h-64 overflow-y-auto custom-scrollbar">
                                {alerts.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-600 italic">
                                        No critical events detected. Monitoring active...
                                    </div>
                                )}
                                {alerts.map((alert, i) => (
                                    <div key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                        <span className="text-gray-600 text-xs mt-0.5">{new Date().toLocaleTimeString()}</span>
                                        <span className={`${alert.includes('Critical') ? 'text-red-400 font-bold' : alert.includes('Notified') ? 'text-green-400' : 'text-indigo-300'}`}>
                                            {alert}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Original Content: Recommendations & Economics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Testing Recommendations */}
                    <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-800">
                        <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                            <span>🧬</span> Genetic Testing Recommendations
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-blue-900/10 rounded-lg border border-blue-900/30">
                                <div className="bg-blue-900/50 p-2.5 rounded-full text-blue-400 text-lg">⚠️</div>
                                <div>
                                    <h4 className="font-bold text-gray-200">Missing Core Genes</h4>
                                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">SLCO1B1 status is unknown. Recommended before starting statin therapy.</p>
                                    <button
                                        onClick={handleOrderPanel}
                                        disabled={ordering || ordered}
                                        className={`mt-3 text-xs px-4 py-1.5 rounded transition-all font-medium flex items-center gap-2 ${ordered ? 'bg-green-600 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20'}`}
                                    >
                                        {ordering ? <Activity className="h-3 w-3 animate-spin" /> : ordered ? <CheckCircle2 className="h-3 w-3" /> : null}
                                        {ordered ? 'Panel Ordered' : ordering ? 'Processing...' : 'Order Panel'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                <div className="bg-gray-800 p-2.5 rounded-full text-gray-400 text-lg">🔍</div>
                                <div>
                                    <h4 className="font-bold text-gray-200">Reflex Testing</h4>
                                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">Consider HLA-B*57:01 screening if Abacavir is being considered.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Economic Impact */}
                    <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-800">
                        <h2 className="text-xl font-bold text-green-400 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                            <span>💰</span> Economic & Insurance View
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Estimated Cost Avoidance</h3>
                                <div className="text-4xl font-bold text-green-500 flex items-baseline gap-2">
                                    $4,250 <span className="text-sm font-normal text-gray-400">/ patient / year</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">By preventing ineffective prescriptions and Adverse Drug Reactions (ADRs).</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-gray-800">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">CPT Code</div>
                                    <div className="font-mono font-bold text-xl text-white">81225</div>
                                    <div className="text-xs text-green-500 font-medium mt-1 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Covered
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-gray-800">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Prior Auth</div>
                                    <div className="font-bold text-xl text-white">Not Required</div>
                                    <div className="text-xs text-green-500 font-medium mt-1 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Pre-approved
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
