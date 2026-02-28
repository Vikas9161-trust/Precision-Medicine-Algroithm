import React, { useState, useRef, useEffect } from 'react';
import { Scan, Pill, AlertTriangle, CheckCircle2, ShieldAlert, Loader2, Info, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PillScanner() {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [scannedDrugs, setScannedDrugs] = useState<any[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Cleanup camera when component unmounts
    useEffect(() => {
        return () => stopCamera();
    }, []);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const startCamera = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer back camera on mobile
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setCameraError("Camera access denied or unavailable.");
        }
    };

    const handleScan = async () => {
        setScanning(true);
        setScanResult(null);

        // Start camera feed
        await startCamera();

        // Simulate scanning delay
        setTimeout(() => {
            setScanning(false);
            stopCamera();

            const newResult = {
                id: Date.now(),
                drugName: "Atorvastatin (Lipitor)",
                class: "Statin",
                interaction: "High Risk",
                gene: "SLCO1B1",
                phenotype: "Poor Metabolizer",
                recommendation: "Avoid use. Prescribe alternative statin (e.g., Rosuvastatin) or reduce dose due to high risk of myopathy.",
                confidence: "98%"
            };

            setScanResult(newResult);

            // Add to feed
            setScannedDrugs(prev => [newResult, ...prev]);
        }, 3000);
    };

    const handleReset = () => {
        setScanResult(null);
        setScanning(false);
        stopCamera();
    };

    return (
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-black border-indigo-500/30 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardHeader className="border-b border-indigo-500/10 pb-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl text-white">
                            <Scan className="h-5 w-5 text-indigo-400" />
                            Pharmacogenomic Pill Scanner
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Scan a medication to instantly check genetic compatibility.
                        </CardDescription>
                    </div>
                    {scanResult && (
                        <Badge variant="outline" className="border-red-500 text-red-400 bg-red-950/30">
                            Risk Detected
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-6 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {!scanResult ? (
                        <div className="flex flex-col items-center justify-center space-y-6">
                            {/* Scanner Area */}
                            <div className="relative w-full max-w-sm aspect-square rounded-2xl border-2 border-dashed border-indigo-500/50 bg-indigo-950/20 flex items-center justify-center overflow-hidden">

                                {/* Video Feed (Camera) */}
                                {scanning && !cameraError && (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}

                                {/* Camera Error Message fallback */}
                                {scanning && cameraError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gray-900/90 z-20">
                                        <ShieldAlert className="h-8 w-8 text-red-500 mb-2" />
                                        <p className="text-xs text-red-400 font-medium">{cameraError}</p>
                                    </div>
                                )}

                                {/* The Item Being Scanned (Fallback when not scanning) */}
                                {!scanning && (
                                    <div className="transition-all duration-700 scale-100 opacity-100">
                                        <Pill className="h-16 w-16 text-indigo-300" />
                                    </div>
                                )}

                                {/* Scanning Animation Effects */}
                                {scanning && !cameraError && (
                                    <>
                                        {/* Laser Line */}
                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_20px_4px_#4ade80] animate-[scan_2s_ease-in-out_infinite] z-20" />
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-[scan-bg_2s_ease-in-out_infinite] z-10 mix-blend-overlay" />
                                        {/* Corner Brackets */}
                                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-500 z-20" />
                                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-500 z-20" />
                                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-500 z-20" />
                                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-500 z-20" />
                                    </>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="text-center space-y-2">
                                <Button
                                    onClick={handleScan}
                                    disabled={scanning}
                                    className={`w-full sm:w-auto min-w-[200px] transition-all duration-300 ${scanning ? 'bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/40'}`}
                                >
                                    {scanning ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Scanning...
                                        </>
                                    ) : (
                                        <>
                                            <Scan className="mr-2 h-4 w-4" />
                                            Initialize Scan
                                        </>
                                    )}
                                </Button>
                                {scanning && <p className="text-xs text-indigo-300 animate-pulse font-mono mt-2">Connecting to PGx Database...</p>}
                            </div>
                        </div>
                    ) : (
                        // Scan Result View
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                <div className="bg-indigo-950/50 p-3 rounded-full border border-indigo-500/30 text-indigo-400">
                                    <Pill className="h-8 w-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{scanResult.drugName}</h3>
                                    <p className="text-sm text-gray-400">Class: {scanResult.class}</p>
                                </div>
                                <Badge variant="outline" className="border-green-500 text-green-400 bg-green-950/30 shrink-0">
                                    Match Confidence: {scanResult.confidence}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-red-950/20 border border-red-500/20 p-4 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-red-400 font-semibold text-sm uppercase tracking-wider mb-3">
                                        <ShieldAlert className="h-4 w-4" /> Genetic Risk
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Affected Gene:</span>
                                        <span className="font-mono text-gray-200 bg-gray-800 px-2 py-0.5 rounded">{scanResult.gene}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Phenotype:</span>
                                        <span className="text-red-400 font-medium">{scanResult.phenotype}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2 border-t border-red-500/10">
                                        <span className="text-gray-400">Interaction Level:</span>
                                        <Badge variant="destructive" className="animate-pulse">{scanResult.interaction}</Badge>
                                    </div>
                                </div>

                                <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-xl flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">
                                            <Info className="h-4 w-4" /> Clinical Recommendation
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {scanResult.recommendation}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 border-blue-500/30 hover:bg-blue-950/50 text-blue-300 transition-colors"
                                    >
                                        View Detailed PGx Report
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <Button onClick={handleReset} variant="ghost" className="text-gray-400 hover:text-white">
                                    <Scan className="mr-2 h-4 w-4" /> Scan Another Medication
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Scan Feed Side Panel */}
                <div className="lg:col-span-1 bg-black/40 rounded-xl border border-gray-800 flex flex-col h-full min-h-[400px]">
                    <div className="p-4 flex items-center gap-2 border-b border-gray-800 bg-gray-900/50 rounded-t-xl">
                        <FileText className="h-4 w-4 text-indigo-400" />
                        <h4 className="font-semibold text-gray-200">Live Scan Feed</h4>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {scannedDrugs.length === 0 ? (
                            <div className="h-full flex flex-col justify-center items-center text-center opacity-60">
                                <FileText className="h-8 w-8 text-gray-600 mb-2" />
                                <p className="text-sm text-gray-400">No drugs scanned yet</p>
                                <p className="text-xs text-gray-500 mt-1">Start scanning to build history</p>
                            </div>
                        ) : (
                            scannedDrugs.map((drug, i) => (
                                <div key={drug.id || i} className="bg-gray-900/80 border border-gray-700/50 p-3 rounded-lg flex flex-col gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-gray-200 text-sm">{drug.drugName}</span>
                                        <Badge variant={drug.interaction === 'High Risk' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0 h-4">
                                            {drug.interaction === 'High Risk' ? 'Toxic' : 'Safe'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-gray-500 font-mono bg-black/50 px-1.5 rounded">{drug.gene}</span>
                                        <span className="text-gray-400">{drug.phenotype}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
