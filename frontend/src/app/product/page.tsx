'use client';
import Link from 'next/link';
import { FaCheckCircle, FaProjectDiagram, FaTag, FaQuestionCircle } from 'react-icons/fa';
import { motion } from "framer-motion";

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                        Product Section & Features
                    </h1>
                    <p className="text-gray-400 text-lg">Comprehensive pharmacogenomic intelligence for clinical safety.</p>
                </motion.div>

                {/* Features */}
                <section id="features" className="mb-20 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaCheckCircle className="text-blue-500 text-2xl" />
                        <h2 className="text-3xl font-bold">Features</h2>
                    </div>
                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-xl">
                        <p className="text-gray-300 leading-relaxed text-lg">
                            PharmaGuard is an AI-powered pharmacogenomic risk prediction system that analyzes patient VCF files to identify genetic variants affecting drug metabolism. It provides personalized drug recommendations, adverse drug reaction risk scoring, and explainable AI-based clinical insights.
                        </p>
                    </div>
                </section>

                {/* Integration */}
                <section id="integration" className="mb-20 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaProjectDiagram className="text-green-500 text-2xl" />
                        <h2 className="text-3xl font-bold">Integration</h2>
                    </div>
                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-xl">
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Our platform integrates with hospital EHR systems, genetic testing labs, drug databases, and clinical pharmacogenomics guidelines (like CPIC standards). It supports secure API-based data exchange and real-time genomic analysis.
                        </p>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="mb-20 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaTag className="text-yellow-500 text-2xl" />
                        <h2 className="text-3xl font-bold">Pricing</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Starter Plan", desc: "For research students & small clinics" },
                            { name: "Professional Plan", desc: "For hospitals & diagnostic labs" },
                            { name: "Enterprise Plan", desc: "For large healthcare networks" }
                        ].map((plan, i) => (
                            <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors">
                                <h3 className="font-bold text-blue-400 mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-gray-500 italic text-sm">Custom pricing available based on patient volume and API usage.</p>
                </section>

                {/* FAQ */}
                <section id="faq" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaQuestionCircle className="text-indigo-500 text-2xl" />
                        <h2 className="text-3xl font-bold">FAQ</h2>
                    </div>
                    <div className="space-y-6">
                        {[
                            { q: "What is a VCF file?", a: "A VCF file contains genetic variant data obtained from DNA sequencing." },
                            { q: "Is patient data secure?", a: "Yes. We use encrypted storage and HIPAA-compliant security protocols." },
                            { q: "Does it replace doctors?", a: "No. It supports clinicians by providing AI-based decision assistance." },
                            { q: "Which drugs are supported?", a: "Warfarin, Clopidogrel, Antidepressants, Antipsychotics, and more." }
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                                <h4 className="font-bold text-white mb-2 text-lg">Q. {item.q}</h4>
                                <p className="text-gray-400">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="mt-20 text-center">
                    <Link href="/">
                        <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mx-auto">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
