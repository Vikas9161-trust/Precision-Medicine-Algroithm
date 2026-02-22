import React from 'react';
import Link from 'next/link';
import {
    UserCircle,
    Activity,
    Lightbulb,
    Calendar,
    Stethoscope,
    ClipboardList,
    LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer no-underline group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                            P
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-lg leading-tight tracking-tight">PharmaGuard</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-3 items-center">
                        <Link href="/patient-hub" className="text-gray-400 hover:text-blue-400 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 py-1.5 px-3 border border-gray-800/50 rounded-full hover:bg-blue-500/5 hover:border-blue-500/30 group">
                            <UserCircle className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            Patient Hub
                        </Link>
                        <Link href="/risk-analysis" className="text-gray-400 hover:text-red-400 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 py-1.5 px-3 border border-gray-800/50 rounded-full hover:bg-red-500/5 hover:border-red-500/30 group">
                            <Activity className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 transition-colors" />
                            Risk Analysis
                        </Link>
                        <Link href="/preventive-insights" className="text-gray-400 hover:text-yellow-400 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 py-1.5 px-3 border border-gray-800/50 rounded-full hover:bg-yellow-500/5 hover:border-yellow-500/30 group">
                            <Lightbulb className="w-3.5 h-3.5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                            Insights
                        </Link>
                        <Link href="/appointments" className="text-gray-400 hover:text-green-400 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 py-1.5 px-3 border border-gray-800/50 rounded-full hover:bg-green-500/5 hover:border-green-500/30 group">
                            <Calendar className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-400 transition-colors" />
                            Booking
                        </Link>
                        <Link href="/doctor-dashboard" className="text-gray-400 hover:text-blue-400 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 py-1.5 px-3 border border-gray-800/50 rounded-full hover:bg-blue-500/5 hover:border-blue-500/30 group">
                            <Stethoscope className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            Doctor Portal
                        </Link>
                        <Link href="/clinical-action" className="text-gray-400 hover:text-purple-400 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 py-1.5 px-3 border border-gray-800/50 rounded-full hover:bg-purple-500/5 hover:border-purple-500/30 group">
                            <ClipboardList className="w-3.5 h-3.5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                            Clinical Action
                        </Link>
                    </div>

                    {/* Quick Login / User */}
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="no-underline">
                            <span className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all">
                                Login
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
