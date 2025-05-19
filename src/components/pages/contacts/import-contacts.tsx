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
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
        }) => { requestAccessToken: () => void };
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

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
            if (window.google?.accounts) {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                    scope: 'https://www.googleapis.com/auth/contacts.readonly',
                    callback: (response) => {
                        console.log('Google OAuth Response:', response); // Debug OAuth error
                    },
                });
                setGoogleTokenClient(client);
            } else {
                toast.error(intl.formatMessage({
                    id: 'google-api-load-failed',
                    defaultMessage: 'Failed to load Google API. Please try again.',
                }));
            }
        };
        script.onerror = () => {
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
                    }
                    return next;
                });
            }, 200);

            const text = await file.text();
            const parsedContacts = parseVCard(text);

            clearInterval(progressInterval);
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
            clearInterval(progressInterval);
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

        if (source === 'google') {
            if (!window.google || !googleTokenClient) {
                toast.error(intl.formatMessage({
                    id: 'google-api-not-loaded',
                    defaultMessage: 'Google API not loaded. Please try again.',
                }));
                return;
            }
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
                toast.error(intl.formatMessage({
                    id: 'google-client-id-missing',
                    defaultMessage: 'Google Client ID is missing. Check environment configuration.',
                }));
                return;
            }
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

                    clearInterval(progressInterval);
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
                    const timeout = setTimeout(() => {
                        reject(new Error('Token retrieval timed out'));
                    }, 20000);

                    googleTokenClient!.requestAccessToken();
                    // Callback is set in initTokenClient, no need to modify
                    const callback = (response: { access_token?: string; error?: string; error_description?: string }) => {
                        clearTimeout(timeout);
                        if (response.error) {
                            reject(new Error(`OAuth error: ${response.error}`));
                        } else if (!response.access_token) {
                            reject(new Error('No access token received'));
                        } else {
                            resolve(response.access_token);
                        }
                    };
                    // Update callback in initTokenClient
                    setGoogleTokenClient(
                        window.google!.accounts.oauth2.initTokenClient({
                            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                            scope: 'https://www.googleapis.com/auth/contacts.readonly',
                            callback,
                        })
                    );
                });

                clearInterval(progressInterval);

                let allContacts: Person[] = [];
                let nextPageToken: string | undefined;

                do {
                    const url = `https://people.googleapis.com/v1/people:searchContacts?query=&readMask=names,phoneNumbers,emailAddresses${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                    const response = await fetch(url, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch Google Contacts');
                    }

                    const data: PeopleResponse = await response.json();
                    allContacts = allContacts.concat(data.connections || []);
                    nextPageToken = data.nextPageToken;
                } while (nextPageToken);

                setImportProgress(100);

                if (allContacts.length === 0) {
                    toast.error(intl.formatMessage({ id: 'no-google-contacts', defaultMessage: 'No Google contacts to import.' }));
                    setImportSource(null);
                    return;
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
            clearInterval(progressInterval);
            setImportProgress(100);
            toast.error(intl.formatMessage(
                { id: 'import-failed', defaultMessage: 'Failed to import contacts: {message}' },
                { message: (error as Error).message || 'Unknown error' }
            ));
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
                                id='api-not-supported'
                                defaultMessage='Phone contact import requires HTTPS and a supported browser (e.g., Chrome on Android). Try importing a vCard file.'
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
                        <Button variant="outline" onClick={() => setImportSource(null)} className="mt-4">
                            <FormattedMessage id="back" defaultMessage="Back" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}