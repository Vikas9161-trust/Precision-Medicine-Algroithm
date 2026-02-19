'use client';

import React, { useState, useRef, useEffect } from 'react';
import { api } from '@/services/api';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Hello! I'm PharmaGuard AI. Ask me about pharmacogenomics, drug interactions, or gene-drug pairs." }
    ]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [clinicalContext, setClinicalContext] = useState<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch Clinical Context on Mount
    useEffect(() => {
        const fetchContext = async () => {
            try {
                const data = await api.getClinicalData('demo-patient-001');
                if (data && data.length > 0) {
                    setClinicalContext(data[0]);
                    console.log("ChatBot: Loaded Clinical Context", data[0]);
                }
            } catch (e) {
                console.error("ChatBot: Failed to load context", e);
            }
        };
        fetchContext();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Pass clinical context to the API
            const data = await api.chat(userMessage.content, clinicalContext);
            const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error connecting to the server. Please ensure the backend is running."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 px-6 bg-[#0a0a0a] border-t border-gray-800">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-block p-3 bg-blue-900/20 rounded-full mb-4">
                        <Sparkles className="h-6 w-6 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">PharmaGuard AI Assistant</h2>
                    <p className="text-gray-400 mt-2">Get instant answers about your pharmacogenomic questions.</p>
                </div>

                <Card className="shadow-xl bg-[#1e293b] border-gray-800 overflow-hidden h-[600px] flex flex-col">
                    <CardHeader className="bg-gray-900/50 border-b border-gray-800 py-4">
                        <CardTitle className="flex items-center gap-2 text-lg text-white">
                            <Bot className="h-5 w-5 text-blue-400" />
                            <span>Chat with AI</span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                                        {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[80%]">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 border border-gray-700">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                        <span className="text-xs text-gray-400 font-medium">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    <div className="p-4 bg-[#1e293b] border-t border-gray-800">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about CYP2C19, drug interactions..."
                                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-white placeholder-gray-500"
                                disabled={loading}
                            />
                            <Button type="submit" disabled={loading || !input.trim()} className="h-full px-6 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                                <Send className="h-4 w-4 text-white" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </section>
    );
}
