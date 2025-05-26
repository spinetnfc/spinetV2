'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { QrCode, Upload } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { ProfileData } from '@/types/profile';
import { getUserFromCookie } from '@/utils/cookie';

interface ScanContactProps {
    themeColor: string;
    locale: string;
    getProfileData: (profileId: string, userId: string) => Promise<ProfileData | null>;
    createContact: (contact: FormData) => Promise<{ success: boolean; message: any; }>;
}

export default function ScanContact({ themeColor, locale, getProfileData, createContact }: ScanContactProps) {
    const intl = useIntl();
    const user = getUserFromCookie();
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

            // Cleanup function
            return () => {
                if (scanner) {
                    console.log('Destroying QR scanner');
                    scanner.destroy();
                }
            };
        } else {
            console.error('Video element not found');
        }
    }, []);

    useEffect(() => {
        const scanContact = async () => {
            if (scannedUrl && user?._id) {
                try {
                    // Parse the scanned URL
                    const url = new URL(scannedUrl);
                    const pathSegments = url.pathname.split('/').filter(segment => segment);

                    // Check if the URL follows the expected format (e.g., /public-profile/profileLink)
                    if (pathSegments.length < 2 || pathSegments[1] !== 'public-profile') {
                        throw new Error(`Invalid URL format. Expected /public-profile/<profileLink> ${url}`);
                    }

                    const profileLink = pathSegments[2];
                    if (!profileLink) {
                        throw new Error('Profile link is missing');
                    }

                    // Get profile data
                    const profileData = await getProfileData(profileLink, user._id);
                    if (!profileData) {
                        throw new Error('Failed to fetch profile data');
                    }

                    const formData = new FormData();
                    formData.append("fullName", profileData.fullName);

                    // Add links exactly like in add-contact-form
                    const formLinks = [];
                    if (profileData.phoneNumber) {
                        formLinks.push({ title: "phone", link: profileData.phoneNumber });
                    }
                    const emailLink = profileData.links.find(link => link.title.toLowerCase() === 'email');
                    if (emailLink) {
                        formLinks.push({ title: "Email", link: emailLink.link });
                    }

                    // Add tags and links as JSON strings
                    formData.append("tags", JSON.stringify([]));
                    formData.append("links", JSON.stringify(formLinks));

                    const result = await createContact(formData);
                    if (result.success) {
                        toast.success(intl.formatMessage(
                            { id: 'contact-added', defaultMessage: 'Contact {name} added successfully' },
                            { name: profileData.fullName }
                        ));
                    } else {
                        toast.error(intl.formatMessage(
                            { id: 'contact-add-failed', defaultMessage: 'Failed to add contact: {message}' },
                            { message: result.message }
                        ));
                    }
                } catch (error) {
                    console.error('Contact creation error:', error);
                    toast.error(intl.formatMessage({
                        id: 'invalid-url',
                        defaultMessage: 'Invalid profile URL: {message}',
                    }, { message: (error as Error).message || 'Unknown error' }));
                } finally {
                    // Clean up scanner resources
                    if (qrScanner) {
                        qrScanner.stop();
                        // Remove any highlight elements that might remain
                        const highlightElements = document.querySelectorAll('.qr-scanner-highlight');
                        highlightElements.forEach(el => el.remove());
                    }
                    setIsScanning(false);
                    setScannedUrl(null);
                }
            }
        };

        scanContact();
    }, [scannedUrl, user?._id, getProfileData, createContact, intl]);

    // Handle QR code scan result
    const handleQrScan = async (data: string) => {
        if (qrScanner) {
            qrScanner.stop();
            // Remove any highlight elements that might remain
            const highlightElements = document.querySelectorAll('.qr-scanner-highlight');
            highlightElements.forEach(el => el.remove());
        }
        setIsScanning(false);

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

    // Handle redirect after scanning
    // useEffect(() => {
    //     if (scannedUrl) {
    //         try {
    //             // Parse the scanned URL
    //             const url = new URL(scannedUrl);
    //             const pathSegments = url.pathname.split('/').filter(segment => segment);

    //             // Check if the URL follows the expected format (e.g., /redirect/profileLink)
    //             if (pathSegments.length < 2 || pathSegments[0] !== 'redirect') {
    //                 throw new Error('Invalid URL format. Expected /redirect/<profileLink>');
    //             }

    //             const profileLink = pathSegments[1];
    //             if (!profileLink) {
    //                 throw new Error('Profile link is missing');
    //             }

    //             // Redirect to the profile page
    //             router.push(`/${locale}/public-profile/${profileLink}`);
    //         } catch (error) {
    //             console.error('Redirect error:', error);
    //             toast.error(intl.formatMessage({
    //                 id: 'invalid-url',
    //                 defaultMessage: 'Invalid profile URL: {message}',
    //             }, { message: (error as Error).message || 'Unknown error' }));
    //             setScannedUrl(null);
    //         }
    //     }
    // }, [scannedUrl]);

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
                                        // Remove any highlight elements that might remain
                                        const highlightElements = document.querySelectorAll('.qr-scanner-highlight');
                                        highlightElements.forEach(el => el.remove());
                                    }
                                }}
                                className="my-4"
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
            <video
                ref={videoRef}
                className={`w-full max-w-md mx-auto rounded-md ${isScanning ? 'opacity-100' : 'opacity-0'}`}
                autoPlay
                muted
                playsInline
            />
        </div>
    );
}