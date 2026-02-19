import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer no-underline">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                            P
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-lg leading-tight tracking-tight">PharmaGuard</span>
                        </div>
                    </Link>

                    {/* Navigation Links (The 4 Tabs) */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/patient-hub" className="text-gray-300 hover:text-white font-medium text-sm transition py-2">
                            Patient Hub
                        </Link>
                        <Link href="/risk-analysis" className="text-gray-300 hover:text-white font-medium text-sm transition py-2">
                            Risk Intelligence
                        </Link>
                        <Link href="/preventive-insights" className="text-gray-300 hover:text-white transition-colors">
                            Preventive Insights
                        </Link>
                        <Link href="/appointments" className="text-gray-300 hover:text-white transition-colors">
                            Book Online
                        </Link>
                        <Link href="/doctor-dashboard" className="text-blue-400 hover:text-blue-300 transition-colors font-medium border border-blue-500/30 rounded-full px-3 py-1 bg-blue-500/10">
                            Doctor Portal
                        </Link>
                        <Link href="/clinical-action" className="text-gray-300 hover:text-white font-medium text-sm transition py-2">
                            Clinical Action
                        </Link>
                    </div>

                    {/* User Profile / Settings */}
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 transition">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
