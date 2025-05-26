"use client"
import ContactItem from "@/components/pages/contacts/contact-item";
import type { Contact, ContactInput } from "@/types/contact";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIntl } from "react-intl";
import Link from "next/link";
import { Plus } from "lucide-react";


interface ContactListProps {
    filteredContacts: Contact[];
    themeColor: string;
    removeContact: (contactId: string) => Promise<{ success: boolean; message: string }>;
    removeContacts: (contacts: string[]) => Promise<{ success: boolean; message: string }>;
    editContact: (contactId: string, updatedContact: ContactInput) => Promise<{ success: boolean; message: string }>;
    locale: string;
    onContactsDeleted?: (deletedContactIds: string[]) => void;
}

export default function ContactList({
    filteredContacts,
    themeColor,
    removeContact,
    removeContacts,
    editContact,
    locale,
    onContactsDeleted
}: ContactListProps) {
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [localContacts, setLocalContacts] = useState<Contact[]>(filteredContacts);
    const intl = useIntl();

    const handleContactSelect = (contactId: string, checked: boolean) => {
        setSelectedContacts(prev => {
            if (!checked) {
                return prev.filter(id => id !== contactId);
            }
            return [...prev, contactId];
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedContacts(localContacts.map(contact => contact._id));
        } else {
            setSelectedContacts([]);
        }
    };

    const handleBulkDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await removeContacts(selectedContacts);
            if (response.success) {
                // Update local state to remove deleted contacts
                setLocalContacts(prev => prev.filter(contact => !selectedContacts.includes(contact._id)));
                // Clear selection
                setSelectedContacts([]);
                // Notify parent component
                onContactsDeleted?.(selectedContacts);
                toast.success(intl.formatMessage({ id: "Contacts deleted successfully" }));
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error(intl.formatMessage({ id: "Failed to delete contact. Please try again." }));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative">
            {/* Bulk Delete Button */}
            {selectedContacts.length > 0 && (
                <Button
                    onClick={handleBulkDelete}
                    className="fixed bottom-4 end-4 z-100 flex items-center gap-2"
                    variant="destructive"
                    disabled={isDeleting}
                >
                    <Trash2 size={20} />
                    <FormattedMessage id="delete" defaultMessage="Delete" /> ({selectedContacts.length})
                </Button>
            )}

            {/* Contact List */}
            <div className="px-4 mt-2">

                {/* Add contact button */}
                <div className="flex justify-between mt-4">
                    {localContacts.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={selectedContacts.length === localContacts.length}
                                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                            />
                            <FormattedMessage
                                id="select-all-contacts"
                                defaultMessage="Select all contacts"
                            />
                        </div>
                    )}
                    <Button asChild
                        className="flex items-center gap-1"
                        style={{ backgroundColor: themeColor }}
                    >
                        <Link
                            href="/contacts/add-contact"
                        >
                            <Plus size={20} />
                            <FormattedMessage id="add-contact" defaultMessage="Add contact" />
                        </Link>
                    </Button>
                </div>

                {localContacts.length > 0 ? (
                    localContacts.map((contact) => (
                        <div key={contact._id} className="flex items-center gap-4">
                            <Checkbox
                                checked={selectedContacts.includes(contact._id)}
                                onCheckedChange={(checked) => handleContactSelect(contact._id, checked as boolean)}
                            />
                            <div className="flex-1">
                                <ContactItem
                                    contact={contact}
                                    themeColor={themeColor}
                                    removeContact={removeContact}
                                    editContact={editContact}
                                    locale={locale}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-8 text-gray-500">
                        <FormattedMessage id="no-contacts-found" defaultMessage="No contacts found" />
                    </p>
                )}
            </div>
        </div>
    );
}
