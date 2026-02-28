"use client"

import { AppointmentScheduler } from "@/components/AppointmentScheduler"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, MapPin, Star, ShieldCheck } from "lucide-react"

const FEATURED_DOCTORS = [
    {
        name: "Dr. Sarah Chen",
        role: "Genetic Counselor",
        specialty: "Pharmacogenomics",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        name: "Dr. Michael Ross",
        role: "Clinical Pharmacist",
        specialty: "Medication Therapy Mgmt",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        name: "Dr. Emily Blunt",
        role: "Psychiatrist",
        specialty: "Neuro-Behavioral Health",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300"
    }
]

export default function AppointmentsPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Book an <span className="text-blue-500">Online Consultation</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Connect with top genomics specialists and psychiatrists.
                        Choose between secure video calls or in-person clinic visits.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: Doctor List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Featured Specialists
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {FEATURED_DOCTORS.map((doc, idx) => (
                                <Card key={idx} className="bg-[#1e293b] border-gray-800 hover:border-blue-500/50 transition-colors group">
                                    <CardHeader className="flex flex-row gap-4 items-center pb-2">
                                        <img
                                            src={doc.image}
                                            alt={doc.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors"
                                        />
                                        <div>
                                            <CardTitle className="text-lg text-white">{doc.name}</CardTitle>
                                            <CardDescription className="text-blue-400">{doc.role}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                                {doc.specialty}
                                            </Badge>
                                            <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-current" /> {doc.rating}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Video className="h-4 w-4 text-green-500" /> Video
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4 text-orange-500" /> Clinic
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Info Section */}
                        <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 flex gap-4 items-start">
                            <ShieldCheck className="h-8 w-8 text-blue-400 shrink-0" />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300">Secure & Confidential</h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    All video consultations are end-to-end encrypted and HIPAA compliant.
                                    Your genomic data is shared only with your selected specialist during the session.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <AppointmentScheduler />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
