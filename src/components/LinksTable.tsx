'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaCopy, FaCheck, FaTrash, FaChartLine, FaExternalLinkAlt, FaSyncAlt } from 'react-icons/fa';
import Pagination from './Pagination';

interface LinkData {
    id: string;
    shortCode: string;
    shortUrl: string;
    longUrl: string;
    clicks: number;
    lastClickedAt: string | null;
    category: string | null;
    createdAt: string;
}

interface LinksTableProps {
    // refreshTrigger?: number; // Removed as per instruction
}

export default function LinksTable({ /* refreshTrigger */ }: LinksTableProps) {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [deleting, setDeleting] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLinks, setTotalLinks] = useState(0);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const categories = ['News', 'E-commerce', 'Documentation', 'Social Media', 'Entertainment', 'Education', 'Business', 'Technology', 'Other'];

    const fetchLinks = async (page = 1) => {
        try {
            setLoading(page === 1); // Only show loading for initial page
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category !== 'All') params.append('category', category);
            params.append('page', page.toString());
            params.append('limit', '10');

            const response = await fetch(`/api/links?${params}`);
            const data = await response.json();
            setLinks(data.links || []);
            setTotalPages(Math.ceil(data.total / 10));
            setTotalLinks(data.total);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching links:', error);
            toast.error('Failed to load links');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and search/filter updates
    useEffect(() => {
        setLoading(true);
        fetchLinks(1);
    }, [search, category]);

    const handlePageChange = (page: number) => {
        fetchLinks(page);
    };

    const handleDelete = async (shortCode: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return;

        setDeleting(shortCode);
        try {
            const response = await fetch(`/api/links/${shortCode}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Link deleted successfully');
                fetchLinks(currentPage);
            } else {
                toast.error('Failed to delete link');
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            toast.error('Failed to delete link');
        } finally {
            setDeleting(null);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const truncateUrl = (url: string, maxLength = 50) => {
        return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCategoryColor = (cat: string | null) => {
        const colors: Record<string, string> = {
            News: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            'E-commerce': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            Documentation: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
            'Social Media': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
            Entertainment: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
            Education: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
            Business: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
            Technology: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
            Other: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
        };
        return colors[cat || 'Other'] || colors.Other;
    };

    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Your Links</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {totalLinks} {totalLinks === 1 ? 'link' : 'links'} total
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search links..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field text-sm"
                    />

                    {/* Category Filter */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field text-sm"
                    >
                        <option value="All">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Manual Refresh Button */}
                    <button
                        onClick={() => fetchLinks(currentPage)}
                        className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                        title="Refresh links"
                    >
                        <FaSyncAlt className="text-sm" />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </div>

            {links.length === 0 ? (
                <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <FaExternalLinkAlt className="text-3xl text-gray-400" />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No links yet. Create your first one above!
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Short Code</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Target URL</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Clicks</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Last Clicked</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {links.map((link) => (
                                    <tr
                                        key={link.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <code className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
                                                    {link.shortCode}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(link.shortUrl, link.id)}
                                                    className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                                    title="Copy short URL"
                                                >
                                                    {copiedId === link.id ? <FaCheck className="text-green-500" /> : <FaCopy />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <a
                                                href={link.longUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                                                title={link.longUrl}
                                            >
                                                {truncateUrl(link.longUrl)}
                                                <FaExternalLinkAlt className="text-xs opacity-50" />
                                            </a>
                                        </td>
                                        <td className="py-4 px-4">
                                            {link.category && (
                                                <span className={`badge ${getCategoryColor(link.category)} `}>
                                                    {link.category}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {link.clicks}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(link.lastClickedAt)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/code/${link.shortCode}`}
                                                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    title="View stats"
                                                >
                                                    <FaChartLine />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(link.shortCode)}
                                                    disabled={deleting === link.shortCode}
                                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    {deleting === link.shortCode ? (
                                                        <span className="animate-spin">⌛</span>
                                                    ) : (
                                                        <>
                                                            <FaTrash /> Delete
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {links.length} of {totalLinks} links
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
