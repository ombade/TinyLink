'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaLink, FaMagic, FaCopy, FaCheck, FaRobot } from 'react-icons/fa';
import QRCodeDisplay from './QRCodeDisplay';

interface CreateLinkFormProps {
    onSuccess?: () => void;
}

const validationSchema = Yup.object({
    longUrl: Yup.string()
        .url('Please enter a valid URL')
        .required('URL is required'),
    customCode: Yup.string()
        .min(6, 'Code must be at least 6 characters')
        .max(8, 'Code must be at most 8 characters')
        .matches(/^[a-zA-Z0-9]*$/, 'Code must be alphanumeric')
        .optional(),
});

export default function CreateLinkForm({ onSuccess }: CreateLinkFormProps) {
    const [successData, setSuccessData] = useState<any>(null);
    const [showAISuggestions, setShowAISuggestions] = useState(false);
    const [copied, setCopied] = useState(false);

    const formik = useFormik({
        initialValues: {
            longUrl: '',
            customCode: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
            setSuccessData(null);
            try {
                const response = await fetch('/api/links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        longUrl: values.longUrl,
                        customCode: values.customCode || undefined,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMessage = data.error || 'Failed to create link';
                    toast.error(errorMessage);
                    if (errorMessage.includes('code')) {
                        setFieldError('customCode', errorMessage);
                    }
                    return;
                }

                setSuccessData(data);
                toast.success('Link created successfully!');
                resetForm();

                if (data.aiSuggestions && data.aiSuggestions.length > 0) {
                    setShowAISuggestions(true);
                }

                if (onSuccess) onSuccess();
            } catch (err) {
                toast.error('Network error. Please try again.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent flex items-center gap-2">
                <FaMagic className="text-primary-600" /> Create Short Link
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium mb-2">
                        Long URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLink className="text-gray-400" />
                        </div>
                        <input
                            type="url"
                            id="longUrl"
                            {...formik.getFieldProps('longUrl')}
                            placeholder="https://example.com/very/long/url"
                            className={`input-field pl-10 ${formik.touched.longUrl && formik.errors.longUrl
                                ? 'border-red-500 focus:ring-red-500'
                                : ''
                                }`}
                            disabled={formik.isSubmitting}
                        />
                    </div>
                    {formik.touched.longUrl && formik.errors.longUrl && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.longUrl}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="customCode" className="block text-sm font-medium mb-2">
                        Custom Code <span className="text-gray-500 text-xs">(optional, 6-8 characters)</span>
                    </label>
                    <input
                        type="text"
                        id="customCode"
                        {...formik.getFieldProps('customCode')}
                        placeholder="mycode"
                        className={`input-field font-mono ${formik.touched.customCode && formik.errors.customCode
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                            }`}
                        disabled={formik.isSubmitting}
                    />
                    {formik.touched.customCode && formik.errors.customCode ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.customCode}</p>
                    ) : (
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty for AI-generated code
                        </p>
                    )}
                </div>

                {successData && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-4 rounded-lg animate-slide-down">
                        <p className="text-green-800 dark:text-green-400 font-medium mb-2 flex items-center gap-2">
                            <FaCheck className="text-green-500" /> Link created successfully!
                        </p>
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 mb-4">
                            <code className="flex-1 text-sm font-mono text-primary-600 dark:text-primary-400 truncate">
                                {successData.shortUrl}
                            </code>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(successData.shortUrl)}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Copy to clipboard"
                            >
                                {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>

                        {/* QR Code Display */}
                        <div className="flex justify-center mb-4">
                            <QRCodeDisplay url={successData.shortUrl} size={150} />
                        </div>

                        {successData.category && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                                <FaRobot className="text-purple-500" /> AI Category: <span className="font-medium">{successData.category}</span>
                            </p>
                        )}
                        {showAISuggestions && successData.aiSuggestions && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    💡 AI suggested codes:
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {successData.aiSuggestions.map((code: string) => (
                                        <span
                                            key={code}
                                            className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono"
                                        >
                                            {code}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {formik.isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating...
                        </>
                    ) : (
                        <>🚀 Create Short Link</>
                    )}
                </button>
            </form>
        </div>
    );
}
