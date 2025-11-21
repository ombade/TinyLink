'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaLink } from 'react-icons/fa';

export default function Navbar() {
    return (
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                            <FaLink className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                TinyLink
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                AI-Powered URL Shortener
                            </p>
                        </div>
                    </Link>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/ombade"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="GitHub Profile"
                        >
                            <FaGithub className="text-xl" />
                            <span className="hidden sm:inline text-sm font-medium">GitHub</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/om-bade/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="LinkedIn Profile"
                        >
                            <FaLinkedin className="text-xl" />
                            <span className="hidden sm:inline text-sm font-medium">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
