'use client';

import { LabInputForm } from '@/components/LabInputForm';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PatientDataHub() {
    // State to store list of gene profiles
    const [genomicProfile, setGenomicProfile] = useState<any[]>([]);

    // Clinical Data State
    const [clinicalData, setClinicalData] = useState<any>(null);
    const [loadingClinical, setLoadingClinical] = useState(false);

    // For VCF Upload demo
    const [uploading, setUploading] = useState(false);
    const [lastUploadStatus, setLastUploadStatus] = useState<string | null>(null);

    // Fetch Clinical Data
    const fetchClinicalData = async () => {
        setLoadingClinical(true);
        try {
            const data = await api.getClinicalData('demo-patient-001');
            if (data && data.length > 0) {
                // Sort by timestamp desc to ensure latest
                const sorted = [...data].sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                setClinicalData(sorted[0]);
            }
        } catch (e) {
            console.error("Failed to fetch clinical data", e);
        } finally {
            setLoadingClinical(false);
        }
    };

    useEffect(() => {
        fetchClinicalData();
    }, []);

    // Dummy handle for drag drop visual only
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        alert("Please use the 'Upload VCF' button for this demo.");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setLastUploadStatus(null);
        try {
            // Use the new getProfile endpoint which returns a list of gene profiles
            const profiles = await api.getProfile(file);

            // profiles is expected to be an array: [{gene, diplotype, phenotype, ...}, ...]
            setGenomicProfile(profiles);
            setLastUploadStatus("Genomic Profile Successfully Extracted!");
        } catch (err: any) {
            console.error(err);
            setLastUploadStatus(`Upload Failed: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-[#0a0a0a] min-h-screen">
            <h1 className="text-3xl font-bold text-white">Patient Data Hub</h1>
            <p className="text-gray-400">Centralized view of patient genomic and clinical profiles.</p>

            {/* Lab Input Section */}
            <div className="mb-8">
                <LabInputForm onSave={fetchClinicalData} initialData={clinicalData} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genomic Profile Card */}
                <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Genomic Profile (VCF Analysis)</h2>
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-gray-900/50 hover:bg-gray-800 transition relative"
                    >
                        <p className="text-gray-400">Drag & Drop VCF File Here</p>
                        <p className="text-xs text-gray-400 mt-1">or</p>
                        <div className="mt-4 inline-block">
                            <label htmlFor="vcf-upload" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition">
                                {uploading ? 'Processing VCF...' : 'Upload VCF to Create Profile'}
                            </label>
                            <input
                                id="vcf-upload"
                                type="file"
                                accept=".vcf"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </div>
                        {lastUploadStatus && (
                            <p className={`mt-2 text-sm font-medium ${lastUploadStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                                {lastUploadStatus}
                            </p>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="font-medium text-gray-300 mb-2">Detailed Gene Profile</h3>
                        <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-800 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Gene</th>
                                        <th className="px-4 py-2">Diplotype</th>
                                        <th className="px-4 py-2">Phenotype</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genomicProfile.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                                                No VCF data. Upload a file to generate profile.
                                            </td>
                                        </tr>
                                    ) : (
                                        genomicProfile.map((geneData, idx) => (
                                            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800/50">
                                                <td className="px-4 py-3 font-medium text-white">{geneData.gene}</td>
                                                <td className="px-4 py-3 font-mono text-gray-400">{geneData.diplotype}</td>
                                                <td className={`px-4 py-3 font-medium ${geneData.phenotype.includes('Poor') ? 'text-red-600' :
                                                    geneData.phenotype.includes('Normal') ? 'text-green-600' :
                                                        geneData.phenotype.includes('Rapid') ? 'text-purple-600' : 'text-yellow-600'
                                                    }`}>
                                                    {geneData.phenotype}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Clinical Profile Card */}
                <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4 text-green-400">Clinical Profile</h2>

                    <div className="space-y-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h3 className="font-medium text-gray-200">Demographics</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-400">
                                <div>Age: <span className="text-gray-200">45</span></div>
                                <div>Sex: <span className="text-gray-200">Male</span></div>
                                <div>Weight: <span className="text-gray-200">78 kg</span></div>
                                <div>Ethnicity: <span className="text-gray-200">Caucasian</span></div>
                            </div>
                        </div>

                        <div className="bg-green-900/10 p-4 rounded-lg border border-green-900/20">
                            <h3 className="font-medium text-green-400 flex justify-between items-center">
                                <span>Laboratory Data (Latest)</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={fetchClinicalData}
                                        disabled={loadingClinical}
                                        className="p-1 hover:bg-green-900/30 rounded-full transition-colors"
                                        title="Refresh Data"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${loadingClinical ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </h3>
                            {clinicalData ? (
                                <div className="space-y-4 mt-3">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                                        <div>eGFR: <span className={`font-bold ${clinicalData.kft?.egfr < 60 ? 'text-red-400' : 'text-gray-200'}`}>{clinicalData.kft?.egfr ?? 'N/A'}</span></div>
                                        <div>ALT: <span className={`font-bold ${clinicalData.lft?.alt > 40 ? 'text-red-400' : 'text-gray-200'}`}>{clinicalData.lft?.alt ?? 'N/A'}</span></div>
                                        <div>HbA1c: <span className={`font-bold ${clinicalData.hba1c > 6.5 ? 'text-red-400' : 'text-gray-200'}`}>{clinicalData.hba1c ?? 'N/A'}%</span></div>
                                        <div>LDL: <span className={`font-bold ${clinicalData.lipid_profile?.ldl > 130 ? 'text-red-400' : 'text-gray-200'}`}>{clinicalData.lipid_profile?.ldl ?? 'N/A'}</span></div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-800 grid grid-cols-3 gap-4 text-xs text-gray-500">
                                        <div>Creatinine: <span className="text-gray-300">{clinicalData.kft?.creatinine ?? 'N/A'}</span></div>
                                        <div>Bilirubin: <span className="text-gray-300">{clinicalData.lft?.bilirubin ?? 'N/A'}</span></div>
                                        <div>Triglycerides: <span className="text-gray-300">{clinicalData.lipid_profile?.triglycerides ?? 'N/A'}</span></div>
                                    </div>

                                    {/* Mental Health Section in Card */}
                                    <div className="pt-3 border-t border-gray-800">
                                        <h4 className="text-xs font-semibold text-purple-400 uppercase mb-2">Mental Health Assessment</h4>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>GAD-7: <span className="text-gray-200 font-medium">{clinicalData.gad7_score ?? 'N/A'}</span></div>
                                            <div>PHQ-9: <span className="text-gray-200 font-medium">{clinicalData.phq9_score ?? 'N/A'}</span></div>
                                            <div>Stress: <span className="text-gray-200 font-medium">{clinicalData.stress_level ?? '0'}/10</span></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2 italic">
                                    {loadingClinical ? "Fetching records..." : "No clinical data available. Use the form above to enter data."}
                                </p>
                            )}
                        </div>

                        <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-900/20">
                            <h3 className="font-medium text-blue-400">Medication History</h3>
                            <ul className="list-disc pl-5 mt-2 text-sm text-gray-400">
                                <li>Lisinopril 10mg</li>
                                <li>Atorvastatin 20mg</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
