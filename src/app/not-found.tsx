'use client';

import Link from 'next/link';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                        <FaExclamationTriangle className="text-5xl text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    404
                </h1>

                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Link Not Found
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    The short link you're looking for doesn't exist or has been deleted.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <FaHome /> Go to Dashboard
                    </Link>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        💡 <strong>Tip:</strong> Double-check the URL or create a new short link from the dashboard.
                    </p>
                </div>
            </div>
        </main>
    );
}
