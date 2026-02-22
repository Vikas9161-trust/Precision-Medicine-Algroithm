'use client';
import Link from 'next/link';
import { FaUsers, FaBriefcase, FaNewspaper, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';
import { motion } from "framer-motion";

export default function CompanyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Company Section & About
                    </h1>
                    <p className="text-gray-400 text-lg">Mission-driven precision medicine for everyone.</p>
                </motion.div>

                {/* About Us */}
                <section id="about" className="mb-20 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaUsers className="text-teal-400 text-2xl" />
                        <h2 className="text-3xl font-bold">About Us</h2>
                    </div>
                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-xl">
                        <p className="text-gray-300 leading-relaxed text-lg">
                            PharmaGuard is a dedicated precision medicine platform. Our mission is to reduce preventable adverse drug reactions using explainable AI and pharmacogenomics.
                        </p>
                    </div>
                </section>

                {/* Careers */}
                <section id="careers" className="mb-20 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaBriefcase className="text-blue-400 text-2xl" />
                        <h2 className="text-3xl font-bold">Careers</h2>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-lg">
                        <p className="text-gray-300 leading-relaxed text-lg mb-6">
                            We welcome AI researchers, bioinformatics engineers, full-stack developers, and healthcare innovators who want to work on next-generation precision medicine solutions.
                        </p>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">View Openings</button>
                    </div>
                </section>

                {/* Blog */}
                <section id="blog" className="mb-20 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaNewspaper className="text-orange-400 text-2xl" />
                        <h2 className="text-3xl font-bold">Blog</h2>
                    </div>
                    <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
                        <p className="text-white font-bold mb-4 text-lg">Our blog shares insights on:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["Pharmacogenomics", "AI in Healthcare", "Precision Medicine Trends", "Drug Safety Research", "Clinical Case Studies"].map((topic, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-400">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <FaEnvelope className="text-indigo-400 text-2xl" />
                        <h2 className="text-3xl font-bold">Contact</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <FaEnvelope className="text-gray-400" />
                                    <span className="text-gray-300">support@pharmaguard.ai</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span className="text-gray-300">India</span>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-6 text-2xl text-gray-400">
                                <a href="#" className="hover:text-blue-500"><FaLinkedin /></a>
                                <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
                                <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
                                <a href="#" className="hover:text-white"><FaGithub /></a>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-400 mb-6">For partnerships & demos, contact our team using the info provided or book a session directly.</p>
                            <Link href="/appointments">
                                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition">Request a Demo</button>
                            </Link>
                        </div>
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
