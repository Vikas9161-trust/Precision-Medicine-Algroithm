"use client"

import { useState } from "react"
import { VcfUpload } from "@/components/VcfUpload"
import { api } from "@/services/api"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function UploadPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleAnalysis = async (file: File, drug: string) => {
        setLoading(true)
        setError(null)

        try {
            const data = await api.analyze(file, drug)
            // Store result in sessionStorage to access in results page
            sessionStorage.setItem("analysisResult", JSON.stringify(data))
            router.push("/results")
        } catch (err: any) {
            setError(err.message || "An error occurred during analysis")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans text-white">
            <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
                        PharmaGuard Analysis
                    </h1>
                    <p className="text-gray-400">
                        Upload a VCF file and select a drug to generate a pharmacogenomic risk profile.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-lg text-muted-foreground animate-pulse">
                            Analyzing genomic variants and consulting CPIC guidelines...
                        </p>
                    </div>
                ) : (
                    <VcfUpload onAnalysisStart={handleAnalysis} isLoading={loading} />
                )}

                {error && (
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-center animate-in shake duration-300">
                        <p className="font-medium">Error: {error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
