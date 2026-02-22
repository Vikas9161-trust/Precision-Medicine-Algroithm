"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            router.push("/patient-hub");
        }, 2000);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] font-sans">
            <Card className="w-96 shadow-lg animate-in fade-in zoom-in-95 duration-500 bg-[#1e293b] border-gray-800 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-white">Signup</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-[#10b981] hover:bg-[#059669]" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {loading ? "Creating Account..." : "Signup"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline ml-1">Login</Link>
                </CardFooter>
            </Card>
        </div>
    );
}
