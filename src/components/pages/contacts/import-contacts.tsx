'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Upload, Smartphone, User, Check } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import { createContact } from '@/actions/contacts';

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
    themeColor: string;
    locale: string;
}

export default function ImportContacts({ themeColor, locale }: ImportContactsProps) {
    const intl = useIntl();
    const profileId = useAuth().user.selectedProfile;
    const [importSource, setImportSource] = useState<'phone' | 'google' | 'file' | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [addProgress, setAddProgress] = useState(0);
    const [isApiSupported, setIsApiSupported] = useState<boolean | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
    const [googleContacts, setGoogleContacts] = useState<Contact[]>([]);
    const [selectedGoogleContacts, setSelectedGoogleContacts] = useState<string[]>([]);

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
                setGoogleApiLoaded(true);
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
                    const result = await createContact(profileId, formData, "phone");
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

    // Fetch Google access token
    const getGoogleAccessToken = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Token retrieval timed out'));
            }, 30000);

            if (!window.google?.accounts) {
                clearTimeout(timeoutId);
                reject(new Error('Google API not loaded'));
                return;
            }

            // Show a loading message to the user
            toast.info(intl.formatMessage({
                id: 'google-auth-progress',
                defaultMessage: 'Authenticating with Google...',
            }));

            const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                scope: 'https://www.googleapis.com/auth/contacts.readonly',
                callback: (response) => {
                    clearTimeout(timeoutId);

                    if (response.error) {
                        if (response.error === 'popup_closed_by_user') {
                            reject(new Error('Authentication was canceled'));
                        } else {
                            console.error('OAuth error:', response.error, response.error_description);
                            reject(new Error(`Google OAuth error: ${response.error}`));
                        }
                    } else if (response.access_token) {
                        resolve(response.access_token);
                    } else {
                        reject(new Error('No access token received'));
                    }
                }
            });

            // Request the token - this will trigger the OAuth flow
            tokenClient.requestAccessToken();
        });
    };

    // Handle Google contact selection
    const toggleGoogleContactSelection = (contactId: string) => {
        setSelectedGoogleContacts(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    // Handle confirm selection for Google contacts
    const handleConfirmGoogleSelection = async () => {
        if (selectedGoogleContacts.length === 0) {
            toast.error(intl.formatMessage({
                id: 'no-contacts-selected',
                defaultMessage: 'No contacts were selected.',
            }));
            setGoogleContacts([]);
            setSelectedGoogleContacts([]);
            setImportSource(null);
            return;
        }

        setIsAdding(true);
        setAddProgress(0);
        const selectedContacts = googleContacts.filter(contact =>
            selectedGoogleContacts.includes(contact.id)
        );
        const total = selectedContacts.length;
        let completed = 0;

        for (const contact of selectedContacts) {
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
                const result = await createContact(profileId, formData, "phone");//make sure if type "google" is possible
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
        toast.success(intl.formatMessage({
            id: 'all-contacts-added',
            defaultMessage: 'All selected contacts added',
        }));
        setGoogleContacts([]);
        setSelectedGoogleContacts([]);
        setIsAdding(false);
        setImportSource(null);
    };

    // Add a "Select All" functionality to the Google contacts selection UI
    const selectAllGoogleContacts = () => {
        if (selectedGoogleContacts.length === googleContacts.length) {
            setSelectedGoogleContacts([]);
        } else {
            setSelectedGoogleContacts(googleContacts.map(contact => contact.id));
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

            setIsImporting(true);
            setImportProgress(0);

            let progressInterval: NodeJS.Timeout | undefined;
            try {
                progressInterval = setInterval(() => {
                    setImportProgress(prev => {
                        const next = prev + 5;
                        return Math.min(next, 80);
                    });
                }, 200);

                const properties: string[] = ['name', 'tel', 'email'];
                const options = { multiple: true };
                const phoneContacts = await navigator.contacts.select(properties, options);

                clearInterval(progressInterval);
                setImportProgress(100);

                if (phoneContacts.length === 0) {
                    toast.error(intl.formatMessage({
                        id: 'no-contacts-selected',
                        defaultMessage: 'No contacts were selected.',
                    }));
                    setImportSource(null);
                    return;
                }

                const mappedContacts = phoneContacts
                    .filter(contact => contact.name?.[0])
                    .map((contact, index) => ({
                        id: `${index}-${contact.name![0]}-${Date.now()}`,
                        fullName: contact.name![0],
                        phoneNumber: contact.tel?.[0] ?? undefined,
                        email: contact.email?.[0] ?? undefined,
                        companyName: undefined,
                        position: undefined,
                    }));

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
                        const result = await createContact(profileId, formData, "phone");
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
                toast.success(intl.formatMessage({
                    id: 'all-contacts-added',
                    defaultMessage: 'All selected contacts added',
                }));
            } catch (error) {
                clearInterval(progressInterval);
                setImportProgress(100);
                toast.error(intl.formatMessage(
                    { id: 'phone-import-failed', defaultMessage: 'Failed to import phone contacts: {message}' },
                    { message: (error as Error).message || 'Unknown error' }
                ));
            } finally {
                setIsImporting(false);
                setIsAdding(false);
                setImportSource(null);
            }
        } else if (source === 'google') {
            if (!googleApiLoaded) {
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

            setIsImporting(true);
            setImportProgress(0);

            let progressInterval = setInterval(() => {
                setImportProgress(prev => {
                    const next = prev + 5;
                    return Math.min(next, 80);
                });
            }, 200);

            try {
                // Get access token
                const accessToken = await getGoogleAccessToken();
                setImportProgress(60);

                // Automatically continue to fetch contacts after getting token
                let allContacts: Person[] = [];
                let nextPageToken: string | undefined;

                do {
                    const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers,emailAddresses${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                    const response = await fetch(url, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Google API error:', response.status, errorText);
                        throw new Error(`Failed to fetch Google Contacts: ${response.status} ${response.statusText}`);
                    }

                    const data: PeopleResponse = await response.json();
                    if (data.connections) {
                        allContacts = allContacts.concat(data.connections);
                    }
                    nextPageToken = data.nextPageToken;
                    setImportProgress(80 + (allContacts.length / (data.totalItems || 100)) * 20);
                } while (nextPageToken);

                clearInterval(progressInterval);
                setImportProgress(100);

                if (allContacts.length === 0) {
                    toast.error(intl.formatMessage({
                        id: 'no-google-contacts',
                        defaultMessage: 'No Google contacts found to import.',
                    }));
                    setImportSource(null);
                    return;
                }

                const mappedContacts = allContacts
                    .filter(person => person.names?.[0]?.displayName)
                    .map((person, index) => ({
                        id: `${index}-${person.names![0].displayName}-${Date.now()}`,
                        fullName: person.names![0].displayName,
                        phoneNumber: person.phoneNumbers?.[0]?.value ?? undefined,
                        email: person.emailAddresses?.[0]?.value ?? undefined,
                        companyName: undefined,
                        position: undefined,
                    }));

                setGoogleContacts(mappedContacts);

                // Pre-select all contacts by default
                setSelectedGoogleContacts(mappedContacts.map(contact => contact.id));

                toast.success(intl.formatMessage({
                    id: 'contacts-loaded',
                    defaultMessage: 'Found {count} contacts. Select the ones you want to import.',
                    // values: { count: mappedContacts.length }
                }));
            } catch (error) {
                clearInterval(progressInterval);
                setImportProgress(100);
                console.error('Google import error:', error);

                // Better error handling
                if ((error as Error).message === 'Authentication was canceled') {
                    toast.info(intl.formatMessage({
                        id: 'auth-canceled',
                        defaultMessage: 'Authentication was canceled. Please try again.',
                    }));
                } else {
                    toast.error(intl.formatMessage(
                        { id: 'import-failed', defaultMessage: 'Failed to import contacts: {message}' },
                        { message: (error as Error).message || 'Unknown error' }
                    ));
                }
            } finally {
                setIsImporting(false);
            }
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
                            disabled={isImporting || !googleApiLoaded}
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
                    {/* {isApiSupported === false && (
                        <p className="text-sm text-red-500 mt-4">
                            <FormattedMessage
                                id='api-not-supported'
                                defaultMessage='Phone contact import requires HTTPS and a supported browser (e.g., Chrome on Android). Try importing a vCard file.'
                            />
                        </p>
                    )} */}
                </div>
            ) : googleContacts.length > 0 && importSource === 'google' && !isAdding ? (
                <div className="text-center">
                    <h3 className="text-lg font-medium mb-4">
                        <FormattedMessage id="select-google-contacts" defaultMessage="Select Google Contacts to Import" />
                    </h3>
                    <div className="flex items-center justify-between mb-2 px-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={selectedGoogleContacts.length === googleContacts.length}
                                onCheckedChange={selectAllGoogleContacts}
                                className="size-5"
                            />
                            <span className="text-sm font-medium">
                                <FormattedMessage id="select-all" defaultMessage="Select All" />
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            <FormattedMessage
                                id="selected-count"
                                defaultMessage="{selected} of {total} selected"
                                values={{
                                    selected: selectedGoogleContacts.length,
                                    total: googleContacts.length,
                                }}
                            />
                        </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto border rounded-md p-4">
                        {googleContacts.map(contact => (
                            <div
                                key={contact.id}
                                className="flex items-center gap-2 py-2 border-b last:border-b-0"
                            >
                                <Checkbox
                                    checked={selectedGoogleContacts.includes(contact.id)}
                                    onCheckedChange={() => toggleGoogleContactSelection(contact.id)}
                                    className="size-5"
                                />
                                <div className="text-left flex-1">
                                    <p className="font-medium">{contact.fullName}</p>
                                    {contact.phoneNumber && <p className="text-sm text-muted-foreground">{contact.phoneNumber}</p>}
                                    {contact.email && <p className="text-sm text-muted-foreground">{contact.email}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            onClick={handleConfirmGoogleSelection}
                            style={{ backgroundColor: themeColor }}
                            className="flex items-center gap-2"
                        >
                            <Check size={20} />
                            <FormattedMessage id="confirm-selection" defaultMessage="Confirm Selection" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setGoogleContacts([]);
                                setSelectedGoogleContacts([]);
                                setImportSource(null);
                            }}
                        >
                            <FormattedMessage id="cancel" defaultMessage="Cancel" />
                        </Button>
                    </div>
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