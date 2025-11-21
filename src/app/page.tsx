'use client';

import { useState } from 'react';
import CreateLinkForm from '@/components/CreateLinkForm';
import LinksTable from '@/components/LinksTable';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLinkCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout - Hero Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-center">
          {/* Left Side - Hero Section */}
          <div className="text-center lg:text-left animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent break-words">
              Shorten URLs with AI Magic ✨
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
              Create memorable short links with AI-powered suggestions, automatic categorization, and security scanning.
            </p>

            {/* Key Benefits */}
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 dark:text-primary-400 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI-Powered Suggestions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get smart, memorable short code recommendations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent-600 dark:text-accent-400 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Automatic Categorization</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Links are intelligently organized by content type</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Security Scanning</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Every URL is checked for safety and threats</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Create Link Form */}
          <div className="animate-slide-up">
            <CreateLinkForm onSuccess={handleLinkCreated} />
          </div>
        </div>

        {/* Links Table */}
        <div className="animate-slide-up mb-12" style={{ animationDelay: '0.2s' }}>
          <LinksTable />
        </div>

        {/* Features Grid - Moved to Bottom (Above Footer) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">AI Suggestions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smart code recommendations
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🏷️</div>
            <h3 className="font-semibold mb-1">Auto Category</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Intelligent classification
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="font-semibold mb-1">Security Scan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Malicious URL detection
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click tracking & insights
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
