'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Smartphone, User } from 'lucide-react';

// Custom TypeScript declarations for Web Contacts API
interface ContactProperties {
    name?: string[] | null;
    tel?: string[] | null;
    email?: string[] | null;
}

interface ContactsManager {
    select(properties: string[], options?: { multiple?: boolean }): Promise<ContactProperties[]>;
}

interface NavigatorExtended extends Navigator {
    contacts?: ContactsManager;
    userAgent: string;
}

declare const navigator: NavigatorExtended;

// Google Identity Services
interface GoogleAccounts {
    oauth2: {
        initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string; error?: string }) => void;
        }) => { requestAccessToken: (config?: { callback: (response: { access_token: string; error?: string }) => void }) => void };
    };
}

declare global {
    interface Window {
        google?: { accounts: GoogleAccounts };
    }
}

// People API response
interface Person {
    resourceName: string;
    names?: { displayName: string }[];
    phoneNumbers?: { value: string }[];
    emailAddresses?: { value: string }[];
}

interface PeopleResponse {
    connections: Person[];
    nextPageToken?: string;
    totalItems: number;
}

interface Contact {
    id: string;
    fullName: string;
    phoneNumber?: string;
    email?: string;
    companyName?: string;
    position?: string;
}

interface ImportContactsProps {
    createContact: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    themeColor: string;
    locale: string;
}

export default function ImportContacts({ createContact, themeColor, locale }: ImportContactsProps) {
    const intl = useIntl();
    const [importSource, setImportSource] = useState<'phone' | 'google' | 'file' | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [addProgress, setAddProgress] = useState(0);
    const [isApiSupported, setIsApiSupported] = useState<boolean | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [googleTokenClient, setGoogleTokenClient] = useState<ReturnType<GoogleAccounts['oauth2']['initTokenClient']> | null>(null);

    // Check Web Contacts API and load Google Identity Services
    useEffect(() => {
        const isSupported = !!navigator.contacts && typeof navigator.contacts.select === 'function';
        setIsApiSupported(isSupported);
        const userAgent = navigator.userAgent;
        const chromeVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
        const androidVersion = userAgent.match(/Android\s([\d.]+)/)?.[1] || 'Unknown';
        console.log('Web Contacts API:', isSupported ? 'Supported' : 'Not supported', 'HTTPS:', window.location.protocol === 'https:', 'Chrome:', chromeVersion, 'Android:', androidVersion);
        toast.info(
            `Web Contacts API: ${isSupported ? 'Supported' : 'Not supported'}. ` +
            `HTTPS: ${window.location.protocol === 'https:' ? 'Yes' : 'No'}. ` +
            `Chrome: ${chromeVersion}, Android: ${androidVersion}`
        );

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
            console.log('GIS Script Loaded:', !!window.google?.accounts);
            if (window.google?.accounts) {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                    scope: 'https://www.googleapis.com/auth/contacts.readonly',
                    callback: () => { }, // Dummy callback, handled in fetchContacts
                });
                setGoogleTokenClient(client);
                console.log('Google Token Client Initialized');
            } else {
                console.error('GIS Script Failed: window.google.accounts not available');
                toast.error(intl.formatMessage({
                    id: 'google-api-load-failed',
                    defaultMessage: 'Failed to load Google API. Please try again.',
                }));
            }
        };
        script.onerror = () => {
            console.error('GIS Script Load Error');
            toast.error(intl.formatMessage({
                id: 'google-api-load-failed',
                defaultMessage: 'Failed to load Google API. Please try again.',
            }));
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Parse vCard file
    const parseVCard = (content: string): Contact[] => {
        const contacts: Contact[] = [];
        const vCards = content.split('END:VCARD').filter(v => v.includes('BEGIN:VCARD'));

        vCards.forEach((vCard, index) => {
            const lines = vCard.split('\n').map(line => line.trim());
            let fullName = 'Unknown Contact';
            let phoneNumber: string | undefined;
            let email: string | undefined;

            lines.forEach(line => {
                if (line.startsWith('FN:')) {
                    fullName = line.replace('FN:', '').trim() || fullName;
                }
                if (line.startsWith('TEL;') || line.startsWith('TEL:')) {
                    phoneNumber = line.split(':')[1]?.trim();
                }
                if (line.startsWith('EMAIL;') || line.startsWith('EMAIL:')) {
                    email = line.split(':')[1]?.trim();
                }
            });

            if (fullName) {
                contacts.push({
                    id: `${index}-${fullName}-${Date.now()}`,
                    fullName,
                    phoneNumber,
                    email,
                    companyName: undefined,
                    position: undefined,
                });
            }
        });

        return contacts;
    };

    // Handle file upload
    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.vcf') && file.type !== 'text/vcard') {
            toast.error(intl.formatMessage({ id: 'invalid-file', defaultMessage: 'Please upload a valid vCard (.vcf) file.' }));
            return;
        }

        setIsImporting(true);
        setImportProgress(0);

        let progressInterval: NodeJS.Timeout | undefined;
        try {
            progressInterval = setInterval(() => {
                setImportProgress(prev => {
                    const next = prev + 20;
                    if (next >= 80 && progressInterval) {
                        clearInterval(progressInterval);
                        progressInterval = undefined;
                    }
                    return next;
                });
            }, 200);

            const text = await file.text();
            const parsedContacts = parseVCard(text);

            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = undefined;
            }
            setImportProgress(100);

            if (parsedContacts.length === 0) {
                toast.error(intl.formatMessage({ id: 'no-contacts-found', defaultMessage: 'No valid contacts found in the file.' }));
                setImportSource(null);
                return;
            }

            setIsAdding(true);
            setAddProgress(0);
            const total = parsedContacts.length;
            let completed = 0;

            for (const contact of parsedContacts) {
                const formData = new FormData();
                formData.append('fullName', contact.fullName);
                if (contact.phoneNumber) formData.append('phoneNumber', contact.phoneNumber);
                if (contact.email) formData.append('email', contact.email);
                if (contact.companyName) formData.append('companyName', contact.companyName);
                if (contact.position) formData.append('position', contact.position);
                formData.append('tags', JSON.stringify([]));
                formData.append('links', JSON.stringify([
                    ...(contact.phoneNumber ? [{ title: 'phone', link: contact.phoneNumber }] : []),
                    ...(contact.email ? [{ title: 'Email', link: contact.email }] : []),
                ]));

                try {
                    const result = await createContact(formData);
                    if (result.success) {
                        toast.success(intl.formatMessage(
                            { id: 'contact-added', defaultMessage: 'Contact {name} added successfully' },
                            { name: contact.fullName }
                        ));
                    } else {
                        toast.error(intl.formatMessage(
                            { id: 'contact-add-failed', defaultMessage: 'Failed to add contact {name}: {message}' },
                            { name: contact.fullName, message: result.message }
                        ));
                    }
                } catch (error) {
                    toast.error(intl.formatMessage(
                        { id: 'contact-add-error', defaultMessage: 'Error adding contact {name}' },
                        { name: contact.fullName }
                    ));
                }

                completed += 1;
                setAddProgress((completed / total) * 100);
            }

            setAddProgress(100);
            toast.success(intl.formatMessage({ id: 'all-contacts-added', defaultMessage: 'All selected contacts added' }));
        } catch (error) {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = undefined;
            }
            setImportProgress(100);
            toast.error(intl.formatMessage(
                { id: 'import-failed', defaultMessage: 'Failed to import contacts: {message}' },
                { message: (error as Error).message || 'Unknown error' }
            ));
        } finally {
            setIsImporting(false);
            setIsAdding(false);
            setImportSource(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Fetch contacts from phone or Google
    const fetchContacts = async (source: 'phone' | 'google' | 'file') => {
        if (source === 'file') {
            fileInputRef.current?.click();
            return;
        }

        if (source === 'phone') {
            if (!navigator.contacts || typeof navigator.contacts.select !== 'function') {
                toast.error(intl.formatMessage({
                    id: 'api-not-supported',
                    defaultMessage: 'Phone contact import requires HTTPS and a supported browser (e.g., Chrome on Android). Try importing a vCard file.',
                }));
                return;
            }
        }

        if (source === 'google' && !googleTokenClient) {
            console.error('Google Token Client Not Initialized');
            toast.error(intl.formatMessage({
                id: 'google-api-not-loaded',
                defaultMessage: 'Google API not loaded. Please try again.',
            }));
            return;
        }

        setIsImporting(true);
        setImportProgress(0);

        let progressInterval: NodeJS.Timeout | undefined;
        try {
            progressInterval = setInterval(() => {
                setImportProgress(prev => {
                    const next = prev + 20;
                    if (next >= 80 && progressInterval) {
                        clearInterval(progressInterval);
                        progressInterval = undefined;
                    }
                    return next;
                });
            }, 200);

            let mappedContacts: Contact[] = [];

            if (source === 'phone') {
                const properties: string[] = ['name', 'tel', 'email'];
                const options = { multiple: true };
                if (navigator.contacts) {
                    const phoneContacts = await navigator.contacts.select(properties, options);

                    if (progressInterval) {
                        clearInterval(progressInterval);
                        progressInterval = undefined;
                    }
                    setImportProgress(100);

                    if (phoneContacts.length === 0) {
                        toast.error(intl.formatMessage({ id: 'no-contacts-selected', defaultMessage: 'No contacts were selected.' }));
                        setImportSource(null);
                        return;
                    }

                    mappedContacts = phoneContacts
                        .filter(contact => contact.name?.[0])
                        .map((contact, index) => ({
                            id: `${index}-${contact.name![0]}-${Date.now()}`,
                            fullName: contact.name![0],
                            phoneNumber: contact.tel?.[0] ?? undefined,
                            email: contact.email?.[0] ?? undefined,
                            companyName: undefined,
                            position: undefined,
                        }));
                } else {
                    throw new Error('Web Contacts API not available');
                }
            } else if (source === 'google') {
                const accessToken = await new Promise<string>((resolve, reject) => {
                    if (!googleTokenClient || !window.google) {
                        reject(new Error('Google token client not initialized'));
                        return;
                    }
                    const timeout = setTimeout(() => {
                        reject(new Error('Token retrieval timed out'));
                    }, 15000); // 15s timeout
                    googleTokenClient.requestAccessToken({
                        callback: (response) => {
                            clearTimeout(timeout);
                            console.log('Google Token Response:', response);
                            if (response.error) {
                                reject(new Error(response.error));
                            } else {
                                resolve(response.access_token);
                            }
                        }
                    });
                }).catch(err => {
                    console.error('Token Retrieval Error:', err);
                    throw new Error(`Failed to retrieve Google access token: ${err.message}`);
                });

                if (progressInterval) {
                    clearInterval(progressInterval);
                    progressInterval = undefined;
                }

                let allContacts: Person[] = [];
                let nextPageToken: string | undefined;
                let iterationCount = 0;
                const maxIterations = 10; // Prevent infinite loops

                do {
                    const url = `https://people.googleapis.com/v1/people:searchContacts?query=&readMask=names,phoneNumbers,emailAddresses${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                    const response = await fetch(url, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    console.log('People API Response Status:', response.status);
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('Google API Error:', errorData);
                        throw new Error(errorData.error?.message || 'Failed to fetch Google Contacts');
                    }

                    let data: PeopleResponse;
                    try {
                        data = await response.json();
                        console.log('People API Data:', data);
                    } catch (parseError) {
                        console.error('Parse Error:', parseError);
                        throw new Error('Failed to parse People API response');
                    }

                    allContacts = allContacts.concat(data.connections || []);
                    nextPageToken = data.nextPageToken;
                    iterationCount++;
                } while (nextPageToken && iterationCount < maxIterations);

                if (iterationCount >= maxIterations) {
                    console.warn('Max iterations reached in pagination');
                    toast.warning(intl.formatMessage({
                        id: 'google-pagination-limit',
                        defaultMessage: 'Reached pagination limit. Some contacts may not be imported.',
                    }));
                }

                setImportProgress(100);

                if (allContacts.length === 0) {
                    toast.error(intl.formatMessage({ id: 'no-google-contacts', defaultMessage: 'No Google contacts to import.' }));
                    setImportSource(null);
                    return;
                }

                if (allContacts.length > 3000) {
                    toast.warning(intl.formatMessage({
                        id: 'google-import-limit',
                        defaultMessage: 'Google Contacts import is limited to 3,000 contacts. Only the first 3,000 will be imported.',
                    }));
                    allContacts = allContacts.slice(0, 3000);
                }

                mappedContacts = allContacts
                    .filter(person => person.names?.[0]?.displayName)
                    .map((person, index) => ({
                        id: `${index}-${person.names![0].displayName}-${Date.now()}`,
                        fullName: person.names![0].displayName,
                        phoneNumber: person.phoneNumbers?.[0]?.value ?? undefined,
                        email: person.emailAddresses?.[0]?.value ?? undefined,
                        companyName: undefined,
                        position: undefined,
                    }));
            }

            setIsAdding(true);
            setAddProgress(0);
            const total = mappedContacts.length;
            let completed = 0;

            for (const contact of mappedContacts) {
                const formData = new FormData();
                formData.append('fullName', contact.fullName);
                if (contact.phoneNumber) formData.append('phoneNumber', contact.phoneNumber);
                if (contact.email) formData.append('email', contact.email);
                if (contact.companyName) formData.append('companyName', contact.companyName);
                if (contact.position) formData.append('position', contact.position);
                formData.append('tags', JSON.stringify([]));
                formData.append('links', JSON.stringify([
                    ...(contact.phoneNumber ? [{ title: 'phone', link: contact.phoneNumber }] : []),
                    ...(contact.email ? [{ title: 'Email', link: contact.email }] : []),
                ]));

                try {
                    const result = await createContact(formData);
                    if (result.success) {
                        toast.success(intl.formatMessage(
                            { id: 'contact-added', defaultMessage: 'Contact {name} added successfully' },
                            { name: contact.fullName }
                        ));
                    } else {
                        toast.error(intl.formatMessage(
                            { id: 'contact-add-failed', defaultMessage: 'Failed to add contact {name}: {message}' },
                            { name: contact.fullName, message: result.message }
                        ));
                    }
                } catch (error) {
                    toast.error(intl.formatMessage(
                        { id: 'contact-add-error', defaultMessage: 'Error adding contact {name}' },
                        { name: contact.fullName }
                    ));
                }

                completed += 1;
                setAddProgress((completed / total) * 100);
            }

            setAddProgress(100);
            toast.success(intl.formatMessage({ id: 'all-contacts-added', defaultMessage: 'All selected contacts added' }));
        } catch (error: unknown) {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = undefined;
            }
            setImportProgress(100);
            const err = error as Error;
            console.error('Import Error:', err);
            toast.info(`Import Error: ${err.name || 'Unknown'}, Message: ${err.message || 'No message'}`);
            if (source === 'phone') {
                if (err.name === 'SecurityError') {
                    toast.error(intl.formatMessage({ id: 'permission-denied', defaultMessage: 'Permission to access contacts was denied.' }));
                } else if (err.name === 'NotAllowedError') {
                    toast.error(intl.formatMessage({ id: 'permission-not-allowed', defaultMessage: 'Contact access permission is not allowed.' }));
                } else if (err.message === 'Unable to open contacts selector') {
                    toast.error(intl.formatMessage({
                        id: 'selector-failed',
                        defaultMessage: 'Unable to open contacts selector. Ensure HTTPS is used, Chrome permissions are granted, and try again.',
                    }));
                    toast.warning(intl.formatMessage({
                        id: 'check-permissions',
                        defaultMessage: 'Go to Android Settings > Apps > Chrome > Permissions and ensure Contacts access is enabled.',
                    }));
                } else {
                    toast.error(intl.formatMessage(
                        { id: 'import-failed', defaultMessage: 'Failed to import contacts: {message}' },
                        { message: err.message || 'Unknown error' }
                    ));
                }
            } else if (source === 'google') {
                if (err.message.includes('invalid_scope') || err.message.includes('access_denied')) {
                    toast.error(intl.formatMessage({
                        id: 'google-auth-failed',
                        defaultMessage: 'Failed to authenticate with Google. Ensure your account is added as a tester in Google Cloud Console and grant permission to access contacts.',
                    }));
                } else if (err.message.includes('quota')) {
                    toast.error(intl.formatMessage({
                        id: 'google-quota-exceeded',
                        defaultMessage: 'Google API quota exceeded. Please try again later.',
                    }));
                } else if (err.message.includes('Failed to retrieve Google access token')) {
                    toast.error(intl.formatMessage({
                        id: 'google-token-failed',
                        defaultMessage: 'Failed to retrieve Google access token. Ensure your account is a tester in Google Cloud Console and try again.',
                    }));
                } else if (err.message.includes('parse People API response')) {
                    toast.error(intl.formatMessage({
                        id: 'google-parse-failed',
                        defaultMessage: 'Failed to parse Google API response. Please try again.',
                    }));
                } else {
                    toast.error(intl.formatMessage(
                        { id: 'import-failed', defaultMessage: 'Failed to import contacts: {message}' },
                        { message: err.message || 'Unknown error' }
                    ));
                }
            }
        } finally {
            setIsImporting(false);
            setIsAdding(false);
            setImportSource(null);
        }
    };

    // Handle import button click
    const handleImport = (source: 'phone' | 'google' | 'file') => {
        setImportSource(source);
        fetchContacts(source);
    };

    return (
        <div className="py-6 px-4 max-w-4xl mx-auto">
            {!importSource ? (
                <div className="text-center">
                    <Upload size={80} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-4">
                        <FormattedMessage id="import-contacts" defaultMessage="Import Contacts" />
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        <FormattedMessage
                            id="import-contacts-description"
                            defaultMessage="Select a source to import your contacts from."
                        />
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => handleImport('phone')}
                            disabled={isImporting || isApiSupported === false}
                            style={{ backgroundColor: themeColor }}
                            className="flex items-center gap-2"
                        >
                            <Smartphone size={20} />
                            <FormattedMessage id="import-from-phone" defaultMessage="Import from Phone" />
                        </Button>
                        <Button
                            onClick={() => handleImport('google')}
                            disabled={isImporting}
                            style={{ backgroundColor: themeColor }}
                            className="flex items-center gap-2"
                        >
                            <User size={20} />
                            <FormattedMessage id="import-from-google" defaultMessage="Import from Google" />
                        </Button>
                        <Button
                            onClick={() => handleImport('file')}
                            disabled={isImporting}
                            style={{ backgroundColor: themeColor }}
                            className="flex items-center gap-2"
                        >
                            <Upload size={20} />
                            <FormattedMessage id="import-from-file" defaultMessage="Import from File" />
                        </Button>
                    </div>
                    <input
                        type="file"
                        accept=".vcf,text/vcard"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    {isApiSupported === false && (
                        <p className="text-sm text-red-500 mt-4">
                            <FormattedMessage
                                id="api-not-supported"
                                defaultMessage="Phone contact import requires HTTPS and a supported browser (e.g., Chrome on Android). Try importing a vCard file."
                            />
                        </p>
                    )}
                </div>
            ) : (
                <div className="text-center">
                    {isImporting && (
                        <div className="mt-6">
                            <Progress value={importProgress} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-2">
                                <FormattedMessage
                                    id="importing-progress"
                                    defaultMessage="Importing contacts... {progress}%"
                                    values={{ progress: Math.round(importProgress) }}
                                />
                            </p>
                        </div>
                    )}
                    {isAdding && (
                        <div className="mt-6">
                            <Progress value={addProgress} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-2">
                                <FormattedMessage
                                    id="adding-progress"
                                    defaultMessage="Adding contacts... {progress}%"
                                    values={{ progress: Math.round(addProgress) }}
                                />
                            </p>
                        </div>
                    )}
                    {!isImporting && !isAdding && (
                        <Button
                            variant="outline"
                            onClick={() => setImportSource(null)}
                            className="mt-4"
                        >
                            <FormattedMessage id="back" defaultMessage="Back" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}