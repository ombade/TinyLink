'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaHeart, FaCode } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                            TinyLink
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            AI-powered URL shortener with smart categorization, security scanning, and analytics.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/healthz" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Health Check
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Connect</h4>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com/ombade"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                                title="GitHub"
                            >
                                <FaGithub className="text-xl" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/om-bade/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center justify-center transition-colors"
                                title="LinkedIn"
                            >
                                <FaLinkedin className="text-xl" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <p className="flex items-center gap-2">
                            Built with <FaHeart className="text-red-500" /> using Next.js, Prisma & Google Gemini AI
                        </p>
                        <p className="flex items-center gap-2">
                            <FaCode /> © {new Date().getFullYear()} TinyLink. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
