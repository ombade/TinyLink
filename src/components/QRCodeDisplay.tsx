'use client';

import { QRCodeSVG } from 'qrcode.react';
import { FaDownload, FaQrcode } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface QRCodeDisplayProps {
    url: string;
    size?: number;
    showDownload?: boolean;
    title?: string;
}

export default function QRCodeDisplay({ url, size = 200, showDownload = true, title }: QRCodeDisplayProps) {
    const downloadQRCode = () => {
        try {
            const svg = document.getElementById('qr-code-svg');
            if (!svg) return;

            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            canvas.width = size;
            canvas.height = size;

            img.onload = () => {
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'qrcode.png';
                        link.click();
                        URL.revokeObjectURL(url);
                        toast.success('QR code downloaded!');
                    }
                });
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        } catch (error) {
            console.error('Error downloading QR code:', error);
            toast.error('Failed to download QR code');
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {title && (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FaQrcode className="text-primary-600" />
                    {title}
                </div>
            )}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                <QRCodeSVG
                    id="qr-code-svg"
                    value={url}
                    size={size}
                    level="H"
                    includeMargin={true}
                    className="rounded"
                />
            </div>
            {showDownload && (
                <button
                    onClick={downloadQRCode}
                    className="btn-secondary text-sm flex items-center gap-2"
                >
                    <FaDownload /> Download QR Code
                </button>
            )}
        </div>
    );
}
