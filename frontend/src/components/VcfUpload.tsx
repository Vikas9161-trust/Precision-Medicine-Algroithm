"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone" // Need to install this, or implement simple input
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface VcfUploadProps {
    onAnalysisStart: (file: File, drug: string) => void
    isLoading: boolean
}

const DRUGS = [
    "CODEINE",
    "WARFARIN",
    "CLOPIDOGREL",
    "SIMVASTATIN",
    "AZATHIOPRINE",
    "FLUOROURACIL"
]

export function VcfUpload({ onAnalysisStart, isLoading }: VcfUploadProps) {
    const [file, setFile] = React.useState<File | null>(null)
    const [drug, setDrug] = React.useState<string>(DRUGS[0])
    const [error, setError] = React.useState<string | null>(null)

    const validateFile = (selectedFile: File): boolean => {
        if (!selectedFile.name.endsWith(".vcf")) {
            setError("Please upload a valid .vcf file")
            setFile(null)
            return false
        }
        if (selectedFile.size > 100 * 1024 * 1024) {
            setError("File size exceeds 100MB")
            setFile(null)
            return false
        }
        setError(null)
        return true
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (validateFile(selectedFile)) {
                setFile(selectedFile)
            }
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0]
            if (validateFile(selectedFile)) {
                setFile(selectedFile)
            }
        }
    }

    return (
        <Card className="w-full max-w-xl mx-auto border-dashed border-2 bg-card/50">
            <CardHeader>
                <CardTitle>Upload Patient VCF</CardTitle>
                <CardDescription>Drag and drop your VCF file here or click to browse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div
                    className={cn(
                        "flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed transition-colors",
                        "hover:bg-accent/50 cursor-pointer",
                        error ? "border-destructive/50 bg-destructive/10" : "border-muted-foreground/25"
                    )}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("vcf-input")?.click()}
                >
                    <input
                        type="file"
                        id="vcf-input"
                        className="hidden"
                        accept=".vcf"
                        onChange={handleFileChange}
                    />

                    {file ? (
                        <div className="flex flex-col items-center space-y-2 text-primary">
                            <FileText className="h-10 w-10" />
                            <span className="font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                            <Upload className="h-10 w-10" />
                            <span className="text-sm">Drop VCF file here</span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Drug for Analysis</label>
                    <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={drug}
                        onChange={(e) => setDrug(e.target.value)}
                    >
                        {DRUGS.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <Button
                    className="w-full"
                    disabled={!file || isLoading}
                    onClick={() => file && onAnalysisStart(file, drug)}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        "Start Analysis"
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
