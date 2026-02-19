"use client"

import { useState } from "react"
import { VcfUpload } from "@/components/VcfUpload"
import { RiskCard } from "@/components/RiskCard"
import { AnalysisResult, api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
// import { useToast } from "@/components/ui/use-toast"

export default function AnalysisPage() {
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAnalysis = async (file: File, drug: string) => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const data = await api.analyze(file, drug)
            setResult(data)
        } catch (err: any) {
            setError(err.message || "An error occurred during analysis")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">PharmaGuard Analysis</span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {!result && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold tracking-tight mb-2">New Analysis</h2>
                                <p className="text-muted-foreground">Upload a VCF file and select a drug to generate a pharmacogenomic risk profile.</p>
                            </div>
                            <VcfUpload onAnalysisStart={handleAnalysis} isLoading={loading} />
                        </div>
                    )}

                    {loading && !result && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-500">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-lg text-muted-foreground">Analyzing variants and consulting rule engine...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-center animate-in shake duration-300">
                            <p className="font-medium">Error: {error}</p>
                            <Button variant="link" onClick={() => setError(null)} className="mt-2 text-destructive">Try Again</Button>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Analysis Results</h2>
                                <Button variant="outline" onClick={() => setResult(null)}>New Analysis</Button>
                            </div>
                            <RiskCard result={result} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
