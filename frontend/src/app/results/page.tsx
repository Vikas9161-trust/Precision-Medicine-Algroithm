"use client"

import { useEffect, useState } from "react"
import { AnalysisResult } from "@/services/api"
import { RiskCard } from "@/components/RiskCard"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function ResultsPage() {
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const router = useRouter()

    useEffect(() => {
        const storedResult = sessionStorage.getItem("analysisResult")
        if (storedResult) {
            try {
                setResult(JSON.parse(storedResult))
            } catch (e) {
                console.error("Failed to parse result", e)
            }
        } else {
            // Redirect back to upload if no result found
            router.push("/upload")
        }
    }, [router])

    if (!result) {
        return null // Or a loading spinner while redirecting
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between pb-6 border-b">
                    <Button variant="ghost" onClick={() => router.push("/upload")} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        New Analysis
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-muted-foreground mr-2">
                            Analysis ID: {result.patient_id.split('_')[1] || 'UNKNOWN'}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">Clinical Report</h2>
                    <RiskCard result={result} />
                </div>
            </div>
        </div>
    )
}
