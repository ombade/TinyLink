'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaChartLine, FaExternalLinkAlt, FaCalendarAlt, FaShieldAlt, FaRobot, FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StatsChart from '@/components/StatsChart';
import QRCodeDisplay from '@/components/QRCodeDisplay';

interface LinkStats {
    shortCode: string;
    shortUrl: string;
    longUrl: string;
    clicks: number;
    lastClickedAt: string | null;
    category: string | null;
    securityScore: number | null;
    createdAt: string;
    insights: string[];
    recentActivity: number;
    clicks_detail?: { clickedAt: string }[];
}

export default function StatsPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code as string;

    const [stats, setStats] = useState<LinkStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [code]);

    const fetchStats = async () => {
        try {
            const response = await fetch(`/api/links/${code}`);

            if (!response.ok) {
                setError('Link not found');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getUrlMetadata = (url: string) => {
        try {
            const urlObj = new URL(url);
            return {
                domain: urlObj.hostname,
                protocol: urlObj.protocol.replace(':', ''),
                pathLength: urlObj.pathname.length > 1 ? urlObj.pathname.length : 0,
            };
        } catch {
            return { domain: 'Unknown', protocol: 'Unknown', pathLength: 0 };
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">📊</div>
                    <p className="text-gray-600 dark:text-gray-400">Loading stats...</p>
                </div>
            </main>
        );
    }

    if (error || !stats) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold mb-4">Link Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'This link does not exist or has been deleted.'}</p>
                    <Link href="/" className="btn-primary">
                        ← Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    const metadata = getUrlMetadata(stats.longUrl);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FaChartLine className="text-primary-600" /> Link Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Detailed statistics for <span className="font-mono font-medium text-primary-600">{stats.shortCode}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/" className="btn-secondary">
                        ← Dashboard
                    </Link>
                    <a
                        href={stats.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2"
                    >
                        Visit Link <FaExternalLinkAlt className="text-sm" />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Info & Metadata */}
                <div className="space-y-6">
                    {/* Link Info Card */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Link Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Short URL</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-primary-600 dark:text-primary-400 font-mono text-sm break-all">
                                        {stats.shortUrl}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(stats.shortUrl)}
                                        className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                                        title="Copy"
                                    >
                                        {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Target URL</label>
                                <div className="mt-1">
                                    <a
                                        href={stats.longUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 break-all flex items-start gap-1"
                                    >
                                        {stats.longUrl}
                                        <FaExternalLinkAlt className="text-xs mt-1 flex-shrink-0" />
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</label>
                                    <p className="text-sm font-medium mt-1 flex items-center gap-1">
                                        <FaCalendarAlt className="text-gray-400" />
                                        {new Date(stats.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                                    <p className="mt-1">
                                        <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {stats.category || 'Uncategorized'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaShieldAlt className={stats.securityScore && stats.securityScore > 80 ? "text-green-500" : "text-yellow-500"} />
                            Security Analysis
                        </h2>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 dark:text-gray-400">Safety Score</span>
                            <span className={`text-2xl font-bold ${stats.securityScore && stats.securityScore > 80 ? 'text-green-600' :
                                stats.securityScore && stats.securityScore > 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {stats.securityScore}/100
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                            <div
                                className={`h-2.5 rounded-full ${stats.securityScore && stats.securityScore > 80 ? 'bg-green-600' :
                                    stats.securityScore && stats.securityScore > 50 ? 'bg-yellow-500' : 'bg-red-600'
                                    }`}
                                style={{ width: `${stats.securityScore}%` }}
                            ></div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Protocol</span>
                                <span className="font-medium uppercase">{metadata.protocol}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Domain</span>
                                <span className="font-medium">{metadata.domain}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">URL Length</span>
                                <span className="font-medium">{stats.longUrl.length} chars</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Card */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 text-center">QR Code</h2>
                        <QRCodeDisplay url={stats.shortUrl} size={200} />
                    </div>

                    {/* AI Insights */}
                    {stats.insights && stats.insights.length > 0 && (
                        <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-100 dark:border-purple-900/30">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                <FaRobot /> AI Insights
                            </h2>
                            <ul className="space-y-3">
                                {stats.insights.map((insight, index) => (
                                    <li key={index} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <span className="text-purple-500 mt-0.5">•</span>
                                        {insight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Column - Charts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Big Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-blue-100 dark:border-blue-900/30">
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">Total Clicks</p>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.clicks}</p>
                        </div>
                        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-100 dark:border-green-900/30">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium uppercase tracking-wider">Last 7 Days</p>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.recentActivity}</p>
                        </div>
                        <div className="card bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-orange-100 dark:border-orange-900/30">
                            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wider">Avg. Daily</p>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                                {Math.round(stats.recentActivity / 7 * 10) / 10}
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <StatsChart clicks={stats.clicks_detail || []} />
                </div>
            </div>
        </div>
    );
}
