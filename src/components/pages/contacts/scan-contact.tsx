'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { QrCode, Upload } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useRouter } from 'next/navigation';

interface ScanContactProps {
    themeColor: string;
    locale: string;
}

export default function ScanContact({ themeColor, locale }: ScanContactProps) {
    const intl = useIntl();
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scannedUrl, setScannedUrl] = useState<string | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);

    // Initialize QR scanner
    useEffect(() => {
        console.log('useEffect running, videoRef:', videoRef.current);
        if (videoRef.current) {
            const scanner = new QrScanner(
                videoRef.current,
                (result) => handleQrScan(result.data),
                {
                    preferredCamera: 'environment',
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );
            console.log('QR Scanner initialized:', scanner);
            setQrScanner(scanner);
        } else {
            console.error('Video element not found');
        }

        return () => {
            if (qrScanner) {
                console.log('Destroying QR scanner');
                qrScanner.destroy();
            }
        };
    }, []);

    // Handle redirect after scanning
    useEffect(() => {
        if (scannedUrl) {
            const timeout = setTimeout(() => {
                try {
                    // Parse the scanned URL
                    const url = new URL(scannedUrl);
                    const pathSegments = url.pathname.split('/').filter(segment => segment);

                    // Check if the URL follows the expected format (e.g., /redirect/profileLink)
                    if (pathSegments.length < 2 || pathSegments[0] !== 'redirect') {
                        throw new Error('Invalid URL format. Expected /redirect/<profileLink>');
                    }

                    const profileLink = pathSegments[1];
                    if (!profileLink) {
                        throw new Error('Profile link is missing');
                    }

                    // Redirect to the profile page
                    router.push(`/${locale}/public-profile/${profileLink}`);
                } catch (error) {
                    console.error('Redirect error:', error);
                    toast.error(intl.formatMessage({
                        id: 'invalid-url',
                        defaultMessage: 'Invalid profile URL: {message}',
                    }, { message: (error as Error).message || 'Unknown error' }));
                    setScannedUrl(null);
                }
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [scannedUrl, locale, router, intl]);

    // Handle QR code scan result
    const handleQrScan = async (data: string) => {
        setIsScanning(false);
        if (qrScanner) {
            qrScanner.stop();
        }

        setIsProcessing(true);
        setProgress(50);

        try {
            // Validate as a URL
            new URL(data);
            setScannedUrl(data);
            setProgress(100);
        } catch (error) {
            console.error('QR scan error:', error);
            toast.error(intl.formatMessage({
                id: 'scan-failed',
                defaultMessage: 'Failed to process QR code: {message}',
            }, { message: 'Invalid URL' }));
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle QR code image upload
    const handleQrImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error(intl.formatMessage({
                id: 'invalid-file',
                defaultMessage: 'Please upload a valid image file.',
            }));
            return;
        }

        setIsProcessing(true);
        setProgress(20);

        try {
            const result = await QrScanner.scanImage(file);
            await handleQrScan(result);
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error(intl.formatMessage({
                id: 'scan-failed',
                defaultMessage: 'Failed to process QR code: {message}',
            }, { message: (error as Error).message || 'Unknown error' }));
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Start QR code scanning
    const startScanning = async () => {
        console.log('startScanning called', { qrScanner, videoRef: videoRef.current });
        if (!qrScanner || !videoRef.current) {
            toast.error(intl.formatMessage({
                id: 'scanner-not-ready',
                defaultMessage: 'Scanner not ready. Please try again.',
            }));
            return;
        }

        setIsScanning(true);
        try {
            await qrScanner.start();
            console.log('Camera started successfully');
        } catch (error) {
            console.error('Camera access error:', error);
            setIsScanning(false);
            toast.error(intl.formatMessage({
                id: 'camera-access-failed',
                defaultMessage: 'Failed to access camera: {message}',
            }, { message: (error as Error).message || 'Unknown error' }));
        }
    };

    return (
        <div className="py-6 px-4 max-w-4xl mx-auto">
            <video
                ref={videoRef}
                className={`w-full max-w-md mx-auto rounded-md ${isScanning ? '' : 'hidden'}`}
                autoPlay
                muted
                playsInline
            />
            {!scannedUrl && !isScanning && !isProcessing ? (
                <div className="text-center">
                    <QrCode size={80} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-4">
                        <FormattedMessage id="scan-qr-code" defaultMessage="Scan QR Code" />
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        <FormattedMessage
                            id="scan-qr-code-description"
                            defaultMessage="Use your camera to scan a QR code or upload an image containing a QR code."
                        />
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={startScanning}
                            disabled={isProcessing}
                            style={{ backgroundColor: themeColor }}
                            className="flex items-center gap-2"
                        >
                            <QrCode size={20} />
                            <FormattedMessage id="start-scanning" defaultMessage="Start Scanning" />
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessing}
                            style={{ backgroundColor: themeColor }}
                            className="flex items-center gap-2"
                        >
                            <Upload size={20} />
                            <FormattedMessage id="upload-image" defaultMessage="Upload Image" />
                        </Button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleQrImageUpload}
                    />
                </div>
            ) : scannedUrl ? (
                <div className="text-center">
                    <h3 className="text-lg font-medium mb-4">
                        <FormattedMessage id="scanned-profile-link" defaultMessage="Scanned Profile Link" />
                    </h3>
                    <div className="border rounded-md p-4 mb-4">
                        <p className="text-sm text-muted-foreground break-all">{scannedUrl}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        <FormattedMessage
                            id="redirecting"
                            defaultMessage="Redirecting to profile in 5 seconds..."
                        />
                    </p>
                </div>
            ) : (
                <div className="text-center">
                    {isScanning && (
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground mt-2">
                                <FormattedMessage id="scanning" defaultMessage="Scanning for QR code..." />
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsScanning(false);
                                    if (qrScanner) {
                                        qrScanner.stop();
                                    }
                                }}
                                className="mt-4"
                            >
                                <FormattedMessage id="cancel" defaultMessage="Cancel" />
                            </Button>
                        </div>
                    )}
                    {isProcessing && (
                        <div className="mt-6">
                            <Progress value={progress} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-2">
                                <FormattedMessage
                                    id="processing-progress"
                                    defaultMessage="Processing QR code... {progress}%"
                                    values={{ progress: Math.round(progress) }}
                                />
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}