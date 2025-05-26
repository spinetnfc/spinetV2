"use client"
import ContactItem from "@/components/pages/contacts/contact-item";
import type { Contact, ContactInput } from "@/types/contact";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ContactListProps {
    filteredContacts: Contact[];
    themeColor: string;
    removeContact: (contactId: string) => Promise<{ success: boolean; message: string }>;
    editContact: (contactId: string, updatedContact: ContactInput) => Promise<{ success: boolean; message: string }>;
    locale: string;
}

export default function ContactList({
    filteredContacts,
    themeColor,
    removeContact,
    editContact,
    locale,
}: ContactListProps) {
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const handleContactSelect = (contactId: string, checked: boolean) => {
        setSelectedContacts(prev => {
            if (!checked) {
                return prev.filter(id => id !== contactId);
            }
            return [...prev, contactId];
        });
    };

    const handleBulkDelete = () => {
        // Empty function for now - will be implemented later
        console.log("Deleting contacts:", selectedContacts);
    };

    return (
        <div className="relative">
            {/* Bulk Delete Button */}
            {selectedContacts.length > 0 && (
                <Button
                    onClick={handleBulkDelete}
                    className="fixed bottom-4 right-4 z-100 flex items-center gap-2"
                    variant="destructive"

                >
                    <Trash2 size={20} />
                    <FormattedMessage id="delete" defaultMessage="Delete" /> ({selectedContacts.length})
                </Button>
            )}

            {/* Contact List */}
            <div className="px-4 mt-2">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
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
                    <p className="text-center py-8 text-gray-500"><FormattedMessage id="no-contacts-found" defaultMessage="No contacts found" /></p>
                )}
            </div>
        </div>
    );
}
