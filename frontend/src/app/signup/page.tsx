"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Signup:", email, password);
        // Add actual signup logic here later
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700 font-sans">
            <Card className="w-96 shadow-lg animate-in fade-in zoom-in-95 duration-500">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Signup</CardTitle>
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
                        <Button type="submit" className="w-full">
                            Signup
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
