"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Box, HelpCircle, Activity, Play, Square, Flashlight, Loader2, FileText, CheckCircle, AlertCircle, XCircle, Scan } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default function PillScannerPage() {
    const [scanning, setScanning] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scannedDrugs, setScannedDrugs] = useState<any[]>([]);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [vcfLoaded, setVcfLoaded] = useState(false);
    const [variantsCount, setVariantsCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        return () => stopCamera();
    }, []);

    // Effect to attach stream to video element when it becomes available
    useEffect(() => {
        if (cameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [cameraActive]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
        setScanning(false);
        setProgress(0);
    };

    const handleStartCamera = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraActive(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setCameraError("Camera access denied or unavailable.");
            setCameraActive(false);
        }
    };

    const captureFrame = async (): Promise<Blob | null> => {
        if (!videoRef.current) return null;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.8);
        });
    };

    const handleScanPill = async () => {
        if (!cameraActive) return;

        setScanning(true);
        setProgress(0);

        // Simulate progression
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 300);

        try {
            const blob = await captureFrame();
            if (blob) {
                // Call the REAL backend API to analyze the captured image
                const file = new File([blob], 'pill.jpg', { type: 'image/jpeg' });
                const result = await api.scanPill(file);

                if (result && Array.isArray(result) && result.length > 0) {
                    setScannedDrugs(result);
                } else if (result && result.drugs) {
                    setScannedDrugs(result.drugs);
                } else {
                    setScannedDrugs([]);
                }
            }
        } catch (error) {
            console.error("Error scanning pill:", error);
            setCameraError("Failed to analyze image. Try again.");
        } finally {
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => {
                setScanning(false);
                stopCamera();
            }, 500);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulate reading the VCF and finding variants
            setTimeout(() => {
                setVariantsCount(Math.floor(Math.random() * 50) + 10); // Random number between 10 and 60
                setVcfLoaded(true);
            }, 800);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* VCF Banner */}
                <div className={`flex items-center justify-between ${vcfLoaded ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-100 border-gray-200 text-gray-600'} px-4 py-3 rounded-xl shadow-sm border transition-colors`}>
                    <div className="text-sm font-medium flex items-center gap-2">
                        {vcfLoaded ? (
                            <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                VCF loaded — <span className="text-green-600 font-bold">{variantsCount} variants</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                No Patient VCF sequence loaded
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".vcf,.txt"
                        className="hidden"
                    />
                    <button onClick={triggerFileInput} className={`text-sm font-bold transition-colors ${vcfLoaded ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700'}`}>
                        {vcfLoaded ? 'Change File' : 'Upload VCF'}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left: Camera View */}
                    <div className="flex-1 flex flex-col space-y-4">
                        <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video shadow-xl border border-gray-200">

                            {/* Video Feed */}
                            {cameraActive && !cameraError ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                    <div className="text-gray-500 flex flex-col items-center">
                                        <Camera className="h-12 w-12 mb-2 opacity-50" />
                                        <p>{cameraError || "Camera is offline"}</p>
                                    </div>
                                </div>
                            )}

                            {/* Top Right Progress Overlay */}
                            {scanning && (
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                    <div className="w-2 h-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Analyzing {progress}%
                                </div>
                            )}

                            {/* Center Target Frame */}
                            {scanning && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-[80%] h-[50%] border-2 border-white/80 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                                </div>
                            )}

                            {/* Bottom Left OCR Overlay */}
                            {scanning && (
                                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                    OCR processing
                                </div>
                            )}
                        </div>

                        {/* Camera Controls */}
                        <div className="flex justify-center items-center gap-4 bg-white p-3 rounded-full shadow-sm border border-gray-200 px-6 mx-auto">
                            <button onClick={stopCamera} disabled={!cameraActive} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 opacity-50 hover:opacity-100 disabled:opacity-30">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                Stop
                            </button>

                            {!cameraActive ? (
                                <button
                                    onClick={handleStartCamera}
                                    className="flex items-center gap-2 text-sm font-bold text-white bg-slate-700 hover:bg-slate-800 px-8 py-2.5 rounded-full shadow-md transition-all"
                                >
                                    <Camera className="w-4 h-4 ml-1" />
                                    Open Camera
                                </button>
                            ) : (
                                <button
                                    onClick={handleScanPill}
                                    disabled={scanning}
                                    className={`flex items-center gap-2 text-sm font-bold text-white px-8 py-2.5 rounded-full shadow-md transition-all ${scanning
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : scannedDrugs.length > 0
                                            ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                                        }`}
                                >
                                    {scanning ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : scannedDrugs.length > 0 ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Scan className="w-4 h-4" />
                                    )}
                                    {scanning ? `Analyzing...` : scannedDrugs.length > 0 ? `Scanned Successfully` : `Scan Pill`}
                                </button>
                            )}

                            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-yellow-600 px-4 py-2 transition-colors">
                                <Flashlight className="w-4 h-4 text-yellow-500" />
                                Torch
                            </button>
                        </div>
                    </div>

                    {/* Right: Results Panel */}
                    <div className="lg:w-[400px] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-[600px]">
                        {/* Header */}
                        <div className="p-5 flex items-center gap-3 border-b border-gray-100">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">Live Scan Feed</h3>
                                <p className="text-xs text-gray-500">Drugs detected this session</p>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 flex flex-col justify-center p-6 relative">
                            {scannedDrugs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center opacity-60">
                                    <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                                        <FileText className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h4 className="text-gray-900 font-bold mb-1">No drugs scanned yet</h4>
                                    <p className="text-xs text-gray-400 max-w-[200px]">
                                        Start the camera and point it at a medication label to begin scanning
                                    </p>
                                </div>
                            ) : (
                                <div className="h-full overflow-y-auto space-y-4 pb-32">
                                    {scannedDrugs.map((drug) => (
                                        <div key={drug.id} className={`p-4 rounded-xl border ${drug.color === 'bg-red-500' ? 'border-red-100 bg-red-50/50' : 'border-gray-100'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className={`font-bold ${drug.color === 'bg-red-500' ? 'text-red-900' : 'text-gray-900'}`}>{drug.name}</h4>
                                                <Badge variant="outline" className={`${drug.textColor} border-current bg-white`}>
                                                    {drug.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Color Legend (Fixed at Bottom) */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 z-10">
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-4">Color Legend</h5>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm font-medium text-gray-600 bg-gray-50/50 px-3 py-1.5 rounded-lg">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                        Safe — No risk detected
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-medium text-gray-600 bg-gray-50/50 px-3 py-1.5 rounded-lg">
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                        Adjust Dosage — Caution
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-medium text-red-600 bg-red-50/50 px-3 py-1.5 rounded-lg">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse" />
                                        Toxic — Dangerous
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-medium text-gray-600 bg-gray-50/50 px-3 py-1.5 rounded-lg">
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                        Ineffective — Won't work
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
