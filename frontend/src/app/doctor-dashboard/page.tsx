"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filterName, setFilterName] = useState("")

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            const data = await api.getAppointments()
            setAppointments(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Filter Logic
    const filteredAppointments = appointments.filter(app => {
        return app.patient_name.toLowerCase().includes(filterName.toLowerCase())
    })

    // Analysis Stats
    const totalToday = filteredAppointments.length
    const videoCalls = filteredAppointments.filter(a => a.consultation_type === "Online").length
    const clinicVisits = filteredAppointments.filter(a => a.consultation_type === "In-person").length

    return (
        <div className="min-h-screen p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <User className="h-8 w-8 text-blue-500" />
                            Doctor Portal
                        </h1>
                        <p className="text-gray-400">Manage your schedule and patient analysis.</p>
                    </div>

                    {/* Search Filter */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search Patient..."
                                className="pl-9 bg-[#1e293b] border-gray-700 text-white w-64"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Analysis Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-[#1e293b] border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Total Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{totalToday}</div>
                            <p className="text-xs text-gray-500">
                                All upcoming appointments
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1e293b] border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Video Consults</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                                <Video className="h-5 w-5" /> {videoCalls}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1e293b] border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Clinic Visits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                                <MapPin className="h-5 w-5" /> {clinicVisits}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Appointments Table */}
                <Card className="bg-[#1e293b] border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Appointment List</CardTitle>
                        <CardDescription>
                            Real-time overview of your patient bookings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-transparent">
                                    <TableHead className="text-gray-400">Time</TableHead>
                                    <TableHead className="text-gray-400">Date</TableHead>
                                    <TableHead className="text-gray-400">Patient</TableHead>
                                    <TableHead className="text-gray-400">Type</TableHead>
                                    <TableHead className="text-gray-400">Drug / Risk</TableHead>
                                    <TableHead className="text-gray-400">Contact</TableHead>
                                    <TableHead className="text-right text-gray-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Loading appointments...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredAppointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No appointments found for this criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAppointments.map((app) => (
                                        <TableRow key={app.id} className="border-gray-800 hover:bg-gray-800/50">
                                            <TableCell className="font-medium text-white">
                                                {app.appointment_time}
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-sm">
                                                {new Date(app.appointment_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/20">
                                                        {app.patient_name.charAt(0)}
                                                    </div>
                                                    <span className="text-gray-300">{app.patient_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {app.consultation_type === "Online" ? (
                                                    <Badge variant="outline" className="border-blue-500/20 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20">
                                                        <Video className="w-3 h-3 mr-1" /> Video
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-green-500/20 text-green-400 bg-green-500/10 hover:bg-green-500/20">
                                                        <MapPin className="w-3 h-3 mr-1" /> Clinic
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {app.drug && <Badge variant="secondary" className="bg-gray-800 text-gray-300 w-fit">{app.drug}</Badge>}
                                                    {app.risk_label && <span className="text-xs text-red-400">{app.risk_label}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-sm">
                                                {app.phone}<br />
                                                <span className="text-xs opacity-70">{app.email}</span>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Badge className="bg-green-900/50 text-green-400 border-green-500/20">
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
