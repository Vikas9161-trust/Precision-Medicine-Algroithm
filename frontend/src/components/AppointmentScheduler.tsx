"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, CheckCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const DOCTORS = [
    { id: "dr_chen", name: "Dr. Sarah Chen", role: "Geneticist", available: true },
    { id: "dr_ross", name: "Dr. Michael Ross", role: "Clinical Pharmacist", available: true },
    { id: "dr_emily", name: "Dr. Emily Blunt", role: "Psychiatrist", available: true },
]

import { api } from "@/services/api"
import { Loader2 } from "lucide-react"

interface AppointmentSchedulerProps {
    initialDrug?: string;
    initialRisk?: string;
}

export function AppointmentScheduler({ initialDrug = "", initialRisk = "" }: AppointmentSchedulerProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [timeSlot, setTimeSlot] = React.useState<string | null>("09:00") // Default to first slot
    const [doctor, setDoctor] = React.useState<string>(DOCTORS[0].id)
    const [visitType, setVisitType] = React.useState<"video" | "clinic">("video")

    // Form State
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [drug, setDrug] = React.useState(initialDrug)
    const [risk, setRisk] = React.useState(initialRisk)
    const [notes, setNotes] = React.useState("")

    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
    const [booked, setBooked] = React.useState(false)

    const handleBook = async () => {
        if (!date || !timeSlot || !name || !email || !phone) {
            alert("Please fill in all required fields (Name, Email, Phone).");
            return;
        }

        setStatus("loading");
        try {
            console.log("Booking appointment...");
            const result = await api.bookAppointment({
                patient_name: name,
                email: email,
                phone: phone,
                drug: drug || "General Consultation",
                risk_label: risk || "Not Specified",
                doctor_specialization: DOCTORS.find(d => d.id === doctor)?.role || "General",
                appointment_date: date.toISOString().split('T')[0],
                appointment_time: timeSlot,
                consultation_type: visitType === "video" ? "Online" : "In-person",
                status: "Confirmed"
            });
            console.log("Booking success:", result);
            setStatus("success");
            setBooked(true);
        } catch (error: any) {
            console.error("Booking failed:", error);
            setStatus("error");
            alert(`Failed to book appointment: ${error.message || "Unknown error"}`);
        } finally {
            if (status !== "success") setStatus("idle");
        }
    }

    if (booked) {
        return (
            <Card className="bg-[#1e293b] border-green-500/50 shadow-lg text-center h-full flex flex-col justify-center items-center p-6 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                <p className="text-gray-400 max-w-xs mx-auto mb-4">
                    {visitType === "video" ? "Video Link sent to email." : "See you at the clinic."}<br />
                    With <span className="text-blue-400 font-medium">{DOCTORS.find(d => d.id === doctor)?.name}</span><br />
                    <span className="text-white font-medium">{date?.toLocaleDateString()} at {timeSlot}</span>
                </p>
                <div className="bg-gray-800/50 p-4 rounded-lg w-full text-left max-w-sm border border-gray-700">
                    <p className="text-xs text-gray-500 uppercase">Patient</p>
                    <p className="text-sm text-gray-300 font-medium mb-2">{name}</p>

                    <p className="text-xs text-gray-500 uppercase">Details</p>
                    <p className="text-sm text-gray-300 font-medium truncate">{email} • {phone}</p>
                </div>
                <Button variant="outline" className="mt-6" onClick={() => { setBooked(false); setStatus("idle"); }}>
                    Book Another
                </Button>
            </Card>
        )
    }

    return (
        <Card className="bg-[#1e293b] border-gray-800 shadow-lg h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <CalendarIcon className="h-4 w-4 text-blue-400" />
                    Book Consultation
                </CardTitle>
                <CardDescription className="text-xs">
                    Fill in the details to schedule your appointment.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar px-4">

                {/* Visit Type */}
                <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-700">
                    <Label className="text-gray-400 mb-1 block text-xs">Consultation Mode</Label>
                    <RadioGroup defaultValue="video" onValueChange={(v) => setVisitType(v as any)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="video" id="video" className="border-blue-500 text-blue-500 w-3 h-3" />
                            <Label htmlFor="video" className="text-white cursor-pointer text-xs">Online Video</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clinic" id="clinic" className="border-gray-500 text-gray-300 w-3 h-3" />
                            <Label htmlFor="clinic" className="text-white cursor-pointer text-xs">In-Person Clinic</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Specialist Selection */}
                <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">Select Doctor</Label>
                    <Select value={doctor} onValueChange={setDoctor}>
                        <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white h-8 text-xs">
                            <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            {DOCTORS.map(doc => (
                                <SelectItem key={doc.id} value={doc.id} className="text-xs">
                                    {doc.name} ({doc.role})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Calendar & Time in 2 cols */}
                <div className="grid grid-cols-1 gap-2">
                    {/* Time Slots Only */}
                    <div className="space-y-1">
                        <Label className="text-gray-400 text-xs">Available Slots (Today)</Label>
                        <div className="grid grid-cols-4 gap-1">
                            {["09:00", "11:00", "02:00", "04:00"].map((slot) => (
                                <Button
                                    key={slot}
                                    variant={timeSlot === slot ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTimeSlot(slot)}
                                    className={`h-7 text-xs px-1 ${timeSlot === slot
                                        ? "bg-blue-600 text-white border-transparent"
                                        : "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
                                        }`}
                                >
                                    {slot}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Patient Details */}
                <div className="space-y-2 pt-2 border-t border-gray-800">
                    <div className="space-y-1">
                        <Label className="text-gray-400 text-xs">Full Name</Label>
                        <Input
                            placeholder="John Doe"
                            className="bg-gray-900 border-gray-700 text-white h-8 text-xs"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs">Email</Label>
                            <Input
                                placeholder="john@example.com"
                                className="bg-gray-900 border-gray-700 text-white h-8 text-xs"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs">Phone</Label>
                            <Input
                                placeholder="+1 234..."
                                className="bg-gray-900 border-gray-700 text-white h-8 text-xs"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Clinical Details (Optional/Pre-filled) */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs">Drug (Optional)</Label>
                            <Input
                                placeholder="e.g. Warfarin"
                                className="bg-gray-900 border-gray-700 text-white h-8 text-xs"
                                value={drug}
                                onChange={(e) => setDrug(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs">Risk Level</Label>
                            <Input
                                placeholder="Auto-filled"
                                className="bg-gray-900 border-gray-700 text-white h-8 text-xs"
                                value={risk}
                                onChange={(e) => setRisk(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-gray-400 text-xs">Reason / Notes</Label>
                        <Textarea
                            placeholder="Briefly describe your concerns..."
                            className="bg-gray-900 border-gray-700 text-white resize-none text-xs min-h-[60px]"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

            </CardContent>
            <CardFooter className="pt-2 border-t border-gray-800 pb-4 px-4">
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
                    onClick={handleBook}
                    disabled={!date || !timeSlot || !name || !email || !phone || status === "loading"}
                >
                    {status === "loading" ? (
                        <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Booking...
                        </>
                    ) : (
                        visitType === 'video' ? 'Confirm Online Booking' : 'Confirm Clinic Visit'
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
