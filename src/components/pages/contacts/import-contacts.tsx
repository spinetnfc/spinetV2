'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
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
}

declare const navigator: NavigatorExtended;

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
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [addProgress, setAddProgress] = useState(0);
    const [isApiSupported, setIsApiSupported] = useState<boolean | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Check if Web Contacts API is supported
    useEffect(() => {
        setIsApiSupported(!!navigator.contacts && typeof navigator.contacts.select === 'function');
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

        let progressInterval: NodeJS.Timeout | undefined = undefined; // Declare at function scope
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
            } else {
                setContacts(parsedContacts);
                setImportSource('file');
                toast.success(intl.formatMessage(
                    { id: 'contacts-imported', defaultMessage: '{count} contacts imported successfully' },
                    { count: parsedContacts.length }
                ));
            }
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
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Fetch contacts from phone using Web Contacts API
    const fetchContacts = async (source: 'phone' | 'google' | 'file') => {
        if (source === 'google') {
            toast.error(intl.formatMessage({ id: 'source-not-supported', defaultMessage: 'Google contacts import is not supported yet.' }));
            return;
        }

        if (source === 'file') {
            fileInputRef.current?.click();
            return;
        }

        if (!navigator.contacts || typeof navigator.contacts.select !== 'function') {
            toast.error(intl.formatMessage({ id: 'api-not-supported', defaultMessage: 'Contact import is not supported in this browser.' }));
            return;
        }

        setIsImporting(true);
        setImportProgress(0);

        let progressInterval: NodeJS.Timeout | undefined = undefined; // Declare at function scope
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

            const properties: string[] = ['name', 'tel', 'email'];
            const options = { multiple: true };
            const phoneContacts = await navigator.contacts.select(properties, options);

            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = undefined;
            }
            setImportProgress(100);

            const mappedContacts: Contact[] = phoneContacts
                .filter(contact => contact.name?.[0])
                .map((contact, index) => ({
                    id: `${index}-${contact.name![0]}-${Date.now()}`,
                    fullName: contact.name![0],
                    phoneNumber: contact.tel?.[0] ?? undefined,
                    email: contact.email?.[0] ?? undefined,
                    companyName: undefined,
                    position: undefined,
                }));

            setContacts(mappedContacts);
            toast.success(intl.formatMessage(
                { id: 'contacts-imported', defaultMessage: '{count} contacts imported successfully' },
                { count: mappedContacts.length }
            ));
        } catch (error: unknown) {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = undefined;
            }
            setImportProgress(100);
            const err = error as Error;
            if (err.name === 'SecurityError') {
                toast.error(intl.formatMessage({ id: 'permission-denied', defaultMessage: 'Permission to access contacts was denied.' }));
            } else if (err.name === 'NotAllowedError') {
                toast.error(intl.formatMessage({ id: 'permission-not-allowed', defaultMessage: 'Contact access permission is not allowed.' }));
            } else {
                toast.error(intl.formatMessage(
                    { id: 'import-failed', defaultMessage: 'Failed to import contacts: {message}' },
                    { message: err.message || 'Unknown error' }
                ));
            }
        } finally {
            setIsImporting(false);
        }
    };

    // Handle import button click
    const handleImport = (source: 'phone' | 'google' | 'file') => {
        setImportSource(source);
        setContacts([]);
        setSelectedContactIds([]);
        fetchContacts(source);
    };

    // Handle contact selection
    const handleSelectContact = (id: string) => {
        setSelectedContactIds(prev =>
            prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
        );
    };

    // Handle adding selected contacts
    const handleAddContacts = async () => {
        if (selectedContactIds.length === 0) {
            toast.error(intl.formatMessage({ id: 'select-contacts', defaultMessage: 'Please select at least one contact' }));
            return;
        }

        setIsAdding(true);
        setAddProgress(0);
        const total = selectedContactIds.length;
        let completed = 0;

        for (const id of selectedContactIds) {
            const contact = contacts.find(c => c.id === id);
            if (!contact) continue;

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

        setIsAdding(false);
        setAddProgress(100);
        setSelectedContactIds([]);
        toast.success(intl.formatMessage({ id: 'all-contacts-added', defaultMessage: 'All selected contacts added' }));
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
                                defaultMessage="Phone contact import is not supported in this browser. Try importing a vCard file or use Chrome on Android."
                            />
                        </p>
                    )}
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
                </div>
            ) : (
                <div>
                    <h3 className="text-lg font-medium mb-4">
                        <FormattedMessage
                            id="imported-contacts"
                            defaultMessage="Imported Contacts from {source}"
                            values={{ source: importSource === 'phone' ? 'Phone' : importSource === 'file' ? 'File' : 'Google' }}
                        />
                    </h3>
                    {contacts.length === 0 && !isImporting ? (
                        <p className="text-muted-foreground">
                            <FormattedMessage id="no-contacts" defaultMessage="No contacts found." />
                        </p>
                    ) : (
                        <>
                            <ScrollArea className="h-[400px] border rounded-md p-4">
                                {contacts.map(contact => (
                                    <div
                                        key={contact.id}
                                        className="flex items-center gap-3 p-2 border-b last:border-b-0"
                                    >
                                        <Checkbox
                                            checked={selectedContactIds.includes(contact.id)}
                                            onCheckedChange={() => handleSelectContact(contact.id)}
                                            disabled={isAdding}
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">{contact.fullName}</div>
                                            {contact.email && (
                                                <div className="text-sm text-muted-foreground">{contact.email}</div>
                                            )}
                                            {contact.phoneNumber && (
                                                <div className="text-sm text-muted-foreground">{contact.phoneNumber}</div>
                                            )}
                                            {(contact.companyName || contact.position) && (
                                                <div className="text-sm text-muted-foreground">
                                                    {contact.position} {contact.companyName ? `@ ${contact.companyName}` : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        id="selected-contacts"
                                        defaultMessage="{count} contact(s) selected"
                                        values={{ count: selectedContactIds.length }}
                                    />
                                </p>
                                <Button
                                    onClick={handleAddContacts}
                                    disabled={isAdding || selectedContactIds.length === 0}
                                    style={{ backgroundColor: themeColor }}
                                >
                                    <FormattedMessage id="add-selected" defaultMessage="Add Selected Contacts" />
                                </Button>
                            </div>
                            {isAdding && (
                                <div className="mt-4">
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
                        </>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => setImportSource(null)}
                        className="mt-4"
                        disabled={isAdding || isImporting}
                    >
                        <FormattedMessage id="back" defaultMessage="Back" />
                    </Button>
                </div>
            )}
        </div>
    );
}