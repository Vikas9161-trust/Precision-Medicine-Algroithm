import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#050505] text-white py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            P
                        </div>
                        <span className="font-bold text-xl text-white">PharmaGuard</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        AI-powered precision medicine for safer prescriptions.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">© 2026 PharmaGuard</p>
                </div>

                <div>
                    <h3 className="font-bold mb-4 text-white">Product</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link href="/product#features" className="hover:text-blue-400">Features</Link></li>
                        <li><Link href="/product#integration" className="hover:text-blue-400">Integration</Link></li>
                        <li><Link href="/product#pricing" className="hover:text-blue-400">Pricing</Link></li>
                        <li><Link href="/product#faq" className="hover:text-blue-400">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold mb-4 text-white">Company</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link href="/company#about" className="hover:text-blue-400">About Us</Link></li>
                        <li><Link href="/company#careers" className="hover:text-blue-400">Careers</Link></li>
                        <li><Link href="/company#blog" className="hover:text-blue-400">Blog</Link></li>
                        <li><Link href="/company#contact" className="hover:text-blue-400">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold mb-4 text-white">Connect</h3>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><FaFacebook size={20} /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><FaTwitter size={20} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><FaLinkedin size={20} /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><FaInstagram size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs flex justify-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    CPIC-Aligned
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Explainable AI
                </div>
            </div>
        </footer>
    );
};

export default Footer;
