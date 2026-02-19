"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login:", email, password);
        // Add actual login logic here later
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] font-sans">
            <Card className="w-96 shadow-lg animate-in fade-in zoom-in-95 duration-500 bg-[#1e293b] border-gray-800 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-white">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
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
                            Login
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline ml-1">Signup</Link>
                </CardFooter>
            </Card>
        </div>
    );
}
