"use client"

import { useEffect, useState, useMemo } from "react"
import type { AnalysisRecord } from "@/lib/api"
import { getHistory } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Download, Search, FileJson } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from "recharts"

export default function HistoryPage() {
    const [records, setRecords] = useState<AnalysisRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    const sampleRecords: AnalysisRecord[] = [
        {
            id: 1001,
            patient_id: "PATIENT_001",
            drug: "FLUOROURACIL",
            primary_gene: "DPYD",
            phenotype: "PM",
            diplotype: "Unknown",
            risk_label: "Toxic",
            recommendation: "Reduce dose or alternative therapy",
            timestamp: "2026-02-18T10:00:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_001", drug: "FLUOROURACIL", timestamp: "2026-02-18T10:00:00Z",
                risk_assessment: { risk_label: "Toxic", severity: "high", confidence_score: 0.95 },
                pharmacogenomic_profile: {
                    primary_gene: "DPYD", phenotype: "PM", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs3918290", genotype: "0/1", chromosome: "22", position: 42126400, ref: "G", alt: "A" }]
                },
                clinical_recommendation: { recommendation_text: "Reduce dose or alternative therapy" },
                llm_generated_explanation: { summary: "DPYD variant detected.", mechanism: "Reduced DPD enzyme activity.", clinical_interpretation: "Increased risk of severe toxicity." }
            })
        },
        {
            id: 1002,
            patient_id: "PATIENT_002",
            drug: "WARFARIN",
            primary_gene: "CYP2C9",
            phenotype: "IM",
            diplotype: "Unknown",
            risk_label: "Adjust Dosage",
            recommendation: "Lower initial dose",
            timestamp: "2026-02-18T10:15:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_002", drug: "WARFARIN", timestamp: "2026-02-18T10:15:00Z",
                risk_assessment: { risk_label: "Adjust Dosage", severity: "moderate", confidence_score: 0.88 },
                pharmacogenomic_profile: {
                    primary_gene: "CYP2C9", phenotype: "IM", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs1057910", genotype: "1/1", chromosome: "10", position: 96511433, ref: "C", alt: "T" }]
                },
                clinical_recommendation: { recommendation_text: "Lower initial dose" },
                llm_generated_explanation: { summary: "CYP2C9 reduced metabolism.", mechanism: "Slower clearance of Warfarin.", clinical_interpretation: "Risk of bleeding at standard dose." }
            })
        },
        {
            id: 1003,
            patient_id: "PATIENT_003",
            drug: "SIMVASTATIN",
            primary_gene: "SLCO1B1",
            phenotype: "Unknown",
            diplotype: "Unknown",
            risk_label: "Toxic",
            recommendation: "Consider alternative statin",
            timestamp: "2026-02-18T10:30:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_003", drug: "SIMVASTATIN", timestamp: "2026-02-18T10:30:00Z",
                risk_assessment: { risk_label: "Toxic", severity: "high", confidence_score: 0.90 },
                pharmacogenomic_profile: {
                    primary_gene: "SLCO1B1", phenotype: "Unknown", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs4149056", genotype: "0/1", chromosome: "19", position: 3962293, ref: "T", alt: "C" }]
                },
                clinical_recommendation: { recommendation_text: "Consider alternative statin" },
                llm_generated_explanation: { summary: "SLCO1B1 transporter defect.", mechanism: "Reduced hepatic uptake.", clinical_interpretation: "High risk of myopathy." }
            })
        },
        {
            id: 1004,
            patient_id: "PATIENT_004",
            drug: "CAPECITABINE",
            primary_gene: "DPYD",
            phenotype: "Normal",
            diplotype: "Unknown",
            risk_label: "Safe",
            recommendation: "Standard dosing",
            timestamp: "2026-02-18T10:45:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_004", drug: "CAPECITABINE", timestamp: "2026-02-18T10:45:00Z",
                risk_assessment: { risk_label: "Safe", severity: "low", confidence_score: 0.98 },
                pharmacogenomic_profile: {
                    primary_gene: "DPYD", phenotype: "Normal", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs1801159", genotype: "0/0", chromosome: "22", position: 42126700, ref: "C", alt: "T" }]
                },
                clinical_recommendation: { recommendation_text: "Standard dosing" },
                llm_generated_explanation: { summary: "No variants detected.", mechanism: "Normal DPD activity.", clinical_interpretation: "Standard metabolism expected." }
            })
        },
        {
            id: 1005,
            patient_id: "PATIENT_005",
            drug: "PHENYTOIN",
            primary_gene: "CYP2C9",
            phenotype: "IM",
            diplotype: "Unknown",
            risk_label: "Adjust Dosage",
            recommendation: "Monitor plasma levels",
            timestamp: "2026-02-18T11:00:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_005", drug: "PHENYTOIN", timestamp: "2026-02-18T11:00:00Z",
                risk_assessment: { risk_label: "Adjust Dosage", severity: "moderate", confidence_score: 0.85 },
                pharmacogenomic_profile: {
                    primary_gene: "CYP2C9", phenotype: "IM", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs1799853", genotype: "1/1", chromosome: "10", position: 96512300, ref: "G", alt: "A" }]
                },
                clinical_recommendation: { recommendation_text: "Monitor plasma levels" },
                llm_generated_explanation: { summary: "CYP2C9 variant present.", mechanism: "Reduced metabolism.", clinical_interpretation: "Increased risk of toxicity." }
            })
        },
        {
            id: 1006,
            patient_id: "PATIENT_006",
            drug: "ATORVASTATIN",
            primary_gene: "SLCO1B1",
            phenotype: "Unknown",
            diplotype: "Unknown",
            risk_label: "Toxic",
            recommendation: "Switch statin therapy",
            timestamp: "2026-02-18T11:15:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_006", drug: "ATORVASTATIN", timestamp: "2026-02-18T11:15:00Z",
                risk_assessment: { risk_label: "Toxic", severity: "high", confidence_score: 0.89 },
                pharmacogenomic_profile: {
                    primary_gene: "SLCO1B1", phenotype: "Unknown", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs2306283", genotype: "1/1", chromosome: "19", position: 3962500, ref: "A", alt: "G" }]
                },
                clinical_recommendation: { recommendation_text: "Switch statin therapy" },
                llm_generated_explanation: { summary: "SLCO1B1 variant.", mechanism: "Reduced transport.", clinical_interpretation: "Risk of muscle toxicity." }
            })
        },
        {
            id: 1007,
            patient_id: "PATIENT_007",
            drug: "FLUOROURACIL",
            primary_gene: "DPYD",
            phenotype: "IM",
            diplotype: "Unknown",
            risk_label: "Adjust Dosage",
            recommendation: "Dose reduction recommended",
            timestamp: "2026-02-18T11:30:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_007", drug: "FLUOROURACIL", timestamp: "2026-02-18T11:30:00Z",
                risk_assessment: { risk_label: "Adjust Dosage", severity: "moderate", confidence_score: 0.87 },
                pharmacogenomic_profile: {
                    primary_gene: "DPYD", phenotype: "IM", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs67376798", genotype: "0/1", chromosome: "22", position: 412700, ref: "T", alt: "C" }]
                },
                clinical_recommendation: { recommendation_text: "Dose reduction recommended" },
                llm_generated_explanation: { summary: "DPYD variant.", mechanism: "Reduced DPD activity.", clinical_interpretation: "Moderate risk of toxicity." }
            })
        },
        {
            id: 1008,
            patient_id: "PATIENT_008",
            drug: "CLOPIDOGREL",
            primary_gene: "CYP2C19",
            phenotype: "IM",
            diplotype: "Unknown",
            risk_label: "Ineffective",
            recommendation: "Alternative antiplatelet recommended",
            timestamp: "2026-02-18T11:45:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_008", drug: "CLOPIDOGREL", timestamp: "2026-02-18T11:45:00Z",
                risk_assessment: { risk_label: "Ineffective", severity: "high", confidence_score: 0.91 },
                pharmacogenomic_profile: {
                    primary_gene: "CYP2C19", phenotype: "IM", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs4244285", genotype: "0/1", chromosome: "2", position: 9651200, ref: "A", alt: "G" }]
                },
                clinical_recommendation: { recommendation_text: "Alternative antiplatelet recommended" },
                llm_generated_explanation: { summary: "CYP2C19 loss of function.", mechanism: "Cannot activate prodrug.", clinical_interpretation: "Clopidogrel will be ineffective." }
            })
        },
        {
            id: 1009,
            patient_id: "PATIENT_009",
            drug: "WARFARIN",
            primary_gene: "CYP2C9",
            phenotype: "IM",
            diplotype: "Unknown",
            risk_label: "Adjust Dosage",
            recommendation: "Lower initial dose",
            timestamp: "2026-02-18T12:00:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_009", drug: "WARFARIN", timestamp: "2026-02-18T12:00:00Z",
                risk_assessment: { risk_label: "Adjust Dosage", severity: "moderate", confidence_score: 0.86 },
                pharmacogenomic_profile: {
                    primary_gene: "CYP2C9", phenotype: "IM", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs1799853", genotype: "0/1", chromosome: "1", position: 100000, ref: "G", alt: "A" }]
                },
                clinical_recommendation: { recommendation_text: "Lower initial dose" },
                llm_generated_explanation: { summary: "CYP2C9 variant.", mechanism: "Reduced metabolism.", clinical_interpretation: "Increased sensitivity to Warfarin." }
            })
        },
        {
            id: 1010,
            patient_id: "PATIENT_010",
            drug: "WARFARIN",
            primary_gene: "SLCO1B1",
            phenotype: "Unknown",
            diplotype: "Unknown",
            risk_label: "Toxic",
            recommendation: "Consider alternative statin",
            timestamp: "2026-02-18T12:15:00Z",
            full_result_json: JSON.stringify({
                patient_id: "PATIENT_010", drug: "WARFARIN", timestamp: "2026-02-18T12:15:00Z",
                risk_assessment: { risk_label: "Toxic", severity: "high", confidence_score: 0.82 },
                pharmacogenomic_profile: {
                    primary_gene: "SLCO1B1", phenotype: "Unknown", diplotype: "Unknown",
                    detected_variants: [{ rsid: "rs4149056", genotype: "0/1", chromosome: "19", position: 3962800, ref: "T", alt: "C" }]
                },
                clinical_recommendation: { recommendation_text: "Consider alternative statin" },
                llm_generated_explanation: { summary: "SLCO1B1 variant.", mechanism: "Complexity with Warfarin?", clinical_interpretation: "Note: SLCO1B1 usually affects Statins, check clinical validity of this specific interaction." }
            })
        }
    ]

    useEffect(() => {
        getHistory()
            .then(data => {
                // Combine real data with sample data for demo purposes
                // Or just use sample data if real data is empty
                setRecords([...data, ...sampleRecords])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                // Fallback to sample data on error
                setRecords(sampleRecords)
                setLoading(false)
            })
    }, [])

    // --- Derived Data & Stats ---
    const filteredRecords = useMemo(() => {
        return records.filter(record =>
            record.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.drug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.risk_label.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [records, searchTerm])

    const stats = useMemo(() => {
        const total = records.length
        const highRisk = records.filter(r => r.risk_label === "Toxic" || r.risk_label === "Ineffective").length
        const moderateRisk = records.filter(r => r.risk_label === "Adjust Dosage").length
        const safe = records.filter(r => r.risk_label === "Safe").length // Assuming "Safe" or "Normal" label
        // Note: adjust logic based on exact labels from rule engine
        return { total, highRisk, moderateRisk, safe }
    }, [records])

    const chartData = [
        { name: 'High Risk', value: stats.highRisk, color: '#ef4444' }, // red-500
        { name: 'Moderate Risk', value: stats.moderateRisk, color: '#eab308' }, // yellow-500
        { name: 'Safe/Low Risk', value: stats.safe + (stats.total - stats.highRisk - stats.moderateRisk - stats.safe), color: '#22c55e' }, // green-500 + others (unknown)
    ].filter(d => d.value > 0)

    // -- Chart Data Preparation --
    const barChartData = useMemo(() => {
        // Group by Drug and count risks
        const drugStats: Record<string, { name: string, safe: number, risk: number }> = {};

        records.forEach(record => {
            const drug = record.drug;
            if (!drugStats[drug]) {
                drugStats[drug] = { name: drug, safe: 0, risk: 0 };
            }

            if (record.risk_label === "Safe" || record.risk_label === "Normal") {
                drugStats[drug].safe += 1;
            } else {
                drugStats[drug].risk += 1;
            }
        });

        return Object.values(drugStats);
    }, [records]);


    // --- Actions ---
    const handleViewDetails = (record: AnalysisRecord) => {
        try {
            const result = JSON.parse(record.full_result_json)
            sessionStorage.setItem("analysisResult", JSON.stringify(result))
            router.push("/results")
        } catch (e) {
            console.error("Failed to parse result json", e)
        }
    }

    const handleDownload = (record: AnalysisRecord) => {
        const blob = new Blob([record.full_result_json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `PharmaGuard_Analysis_${record.patient_id}_${record.timestamp}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const getRiskColor = (risk: string) => {
        if (risk === "Toxic" || risk === "Ineffective") return "destructive"
        if (risk === "Adjust Dosage") return "warning" // We might need to add warning variant or use default style
        if (risk === "Safe") return "default" // or success if we had it
        return "secondary"
    }

    const getSeverity = (record: AnalysisRecord) => {
        try {
            const json = JSON.parse(record.full_result_json)
            return json.risk_assessment?.severity || "Unknown"
        } catch {
            return "Unknown"
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/50">
                    <div>
                        <Button variant="ghost" onClick={() => router.push("/")} className="mb-2 -ml-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Review previously analyzed pharmacogenomic reports, including detected gene variants, predicted drug risks, and clinical recommendations. Each report is securely stored and available for download in structured JSON format for clinical traceability.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : records.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/10 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-lg">No analysis history found.</p>
                        <Button className="mt-4" onClick={() => router.push("/upload")}>Start New Analysis</Button>
                    </div>
                ) : (
                    <>
                        {/* Dashboard / Stats Section */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Summary Cards */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Analyses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stats.total}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Actionable Alerts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-destructive">{stats.highRisk}</div>
                                    <p className="text-xs text-muted-foreground">Toxic / Ineffective</p>
                                </CardContent>
                            </Card>

                            {/* Graph - Bar Chart */}
                            <Card className="md:row-span-2">
                                <CardHeader>
                                    <CardTitle>Analysis Statistics</CardTitle>
                                    <CardDescription>Risk Distribution by Drug</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barChartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="safe" name="Safe" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                                            <Bar dataKey="risk" name="At Risk" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters & Table Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Filter by drug, patient ID, or risk..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="rounded-md border bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>Patient ID</TableHead>
                                            <TableHead>Drug</TableHead>
                                            <TableHead>Risk Prediction</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRecords.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center">
                                                    No results found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRecords.map((record) => {
                                                const severity = getSeverity(record)
                                                return (
                                                    <TableRow key={record.id}>
                                                        <TableCell className="font-mono text-xs">{record.patient_id}</TableCell>
                                                        <TableCell className="font-medium">{record.drug}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={getRiskColor(record.risk_label) as any} className={
                                                                record.risk_label === "Safe" ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200" :
                                                                    record.risk_label === "Adjust Dosage" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200" :
                                                                        record.risk_label === "Toxic" || record.risk_label === "Ineffective" ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200" :
                                                                            ""
                                                            }>
                                                                {record.risk_label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="capitalize">{severity}</TableCell>
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {new Date(record.timestamp).toLocaleDateString()}
                                                            <span className="text-xs ml-2 opacity-50">
                                                                {new Date(record.timestamp).toLocaleTimeString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" variant="outline" onClick={() => handleViewDetails(record)}>
                                                                    View
                                                                </Button>
                                                                <Button size="sm" variant="ghost" onClick={() => handleDownload(record)}>
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
