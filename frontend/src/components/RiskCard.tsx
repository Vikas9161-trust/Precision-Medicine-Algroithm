import { AnalysisResult } from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Info, Copy, Download, Stethoscope, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RiskCardProps {
    result: AnalysisResult
}

interface RiskCardProps {
    result: AnalysisResult
}

export function RiskCard({ result }: RiskCardProps) {
    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case "safe": return "bg-green-500/15 text-green-700 border-green-500/20"
            case "adjust dosage": return "bg-yellow-500/15 text-yellow-700 border-yellow-500/20"
            case "toxic":
            case "ineffective":
                return "bg-red-500/15 text-red-700 border-red-500/20"
            default: return "bg-gray-500/15 text-gray-700 border-gray-500/20"
        }
    }

    const getRiskIcon = (risk: string) => {
        switch (risk.toLowerCase()) {
            case "safe": return <CheckCircle className="h-6 w-6 text-green-600" />
            case "adjust dosage": return <AlertTriangle className="h-6 w-6 text-yellow-600" />
            case "toxic":
            case "ineffective":
                return <XCircle className="h-6 w-6 text-red-600" />
            default: return <Info className="h-6 w-6 text-gray-600" />
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    }

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `pharmaguard_report_${result.patient_id}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Tabs defaultValue="patient" className="w-full">
                <div className="flex justify-center mb-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-md bg-[#1e293b]">
                        <TabsTrigger value="patient" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            <User className="h-4 w-4 mr-2" />
                            Patient View
                        </TabsTrigger>
                        <TabsTrigger value="clinician" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Clinician View
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="patient" className="space-y-6">
                    {/* Summary Card */}
                    <Card className="border-l-4 border-l-primary shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    {getRiskIcon(result.risk_assessment.risk_label)}
                                    {result.risk_assessment.risk_label}
                                </CardTitle>
                                <CardDescription>
                                    Analysis for {result.drug} • Confidence: {(result.risk_assessment.confidence_score * 100).toFixed(0)}%
                                </CardDescription>
                            </div>
                            <Badge className={getRiskColor(result.risk_assessment.risk_label)}>
                                {result.risk_assessment.severity.toUpperCase()} SEVERITY
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium text-foreground/90">
                                {result.clinical_recommendation.recommendation_text}
                            </p>
                        </CardContent>
                    </Card>

                    {/* AI Explanation */}
                    <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                AI Clinical Explanation
                                <Badge variant="secondary" className="text-xs font-normal">LLM Generated</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="bg-primary/10 p-3 rounded-md border border-primary/20">
                                <span className="font-semibold text-primary block mb-1">Summary</span>
                                <p className="text-foreground font-medium">{result.llm_generated_explanation.summary}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="clinician" className="space-y-6">
                    {/* Clinician Header */}
                    <Card className="border-t-4 border-t-purple-500 bg-[#1e293b] border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-purple-400 font-mono">CLINICAL DECISION SUPPORT REPORT</CardTitle>
                            <CardDescription className="text-gray-400">
                                Patient ID: {result.patient_id} | Timestamp: {new Date(result.timestamp).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Recommendation Box */}
                            <div className="bg-purple-900/10 border border-purple-500/30 p-4 rounded-lg">
                                <h3 className="text-sm font-bold text-purple-300 uppercase mb-2">Prescriptive Recommendation</h3>
                                <p className="text-lg text-white font-medium leading-relaxed">
                                    {result.clinical_recommendation.recommendation_text}
                                </p>
                                <div className="mt-4 pt-4 border-t border-purple-500/20 flex gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block text-xs">Evidence Level</span>
                                        <span className="text-purple-300 font-mono">CPIC Level A</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs">Action Type</span>
                                        <span className="text-purple-300 font-mono">
                                            {result.risk_assessment.risk_label === "Safe" ? "MONITOR" : "INTERVENE"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-700">
                                    <h4 className="text-xs text-gray-500 uppercase mb-1">Primary Gene Target</h4>
                                    <div className="text-xl font-mono text-white">{result.pharmacogenomic_profile.primary_gene}</div>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-700">
                                    <h4 className="text-xs text-gray-500 uppercase mb-1">Predicted Phenotype</h4>
                                    <div className="text-xl font-mono text-white">{result.pharmacogenomic_profile.phenotype}</div>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-700">
                                    <h4 className="text-xs text-gray-500 uppercase mb-1">Diplotype Structure</h4>
                                    <div className="text-xl font-mono text-white">{result.pharmacogenomic_profile.diplotype}</div>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-700">
                                    <h4 className="text-xs text-gray-500 uppercase mb-1">Variant Logic</h4>
                                    <div className="text-xs font-mono text-gray-400 break-words">
                                        {result.pharmacogenomic_profile.detected_variants.map(v => `${v.rsid}(${v.genotype})`).join(', ') || "No specific variants mapped"}
                                    </div>
                                </div>
                            </div>

                            {/* Mechanism of Action */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-300 uppercase mb-2">Mechanism & Interpretation</h3>
                                <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-4">
                                    {result.llm_generated_explanation.clinical_interpretation}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy JSON
                </Button>
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </div>
        </div>
    )
}
