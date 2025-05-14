"use client";

import { Edit, MoreVertical, Trash2 } from "lucide-react";
import ContactAvatar from "./contact-avatar";
import type { Contact, ContactInput } from "@/types/contact";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { useState } from "react";
import EditContactForm from "./edit-contact-form";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";
import { getUserFromCookie } from "@/utils/cookie";

type ContactItemProps = {
    contact: Contact;
    themeColor: string;
    editContact: (contactId: string, contact: ContactInput) => Promise<{ success: boolean; message: string }>;
    removeContact: (contactId: string) => Promise<{ success: boolean; message: string }>;
};

export default function ContactItem({ contact, themeColor, editContact, removeContact }: ContactItemProps) {
    const profileId = getUserFromCookie().selectedProfile || null;
    const [showEditForm, setShowEditForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const intl = useIntl();
    const name = contact.name ?? "Unnamed Contact";
    const Profile = contact.Profile ?? {};
    const contactId = contact._id;
    const position = typeof Profile.position === "string" ? Profile.position.trim() : "";
    const companyName = typeof Profile.companyName === "string" ? Profile.companyName.trim() : "";
    const hasPositionOrCompany = position !== "" || companyName !== "";

    const handleEditSuccess = () => {
        setShowEditForm(false);
        toast.success(intl.formatMessage({ id: "Contact updated successfully" }));
        window.location.reload();
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const response = await removeContact(contactId);
            if (response.success) {
                toast.success(intl.formatMessage({ id: "Contact deleted successfully" }));
                window.location.reload();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error(intl.formatMessage({ id: "Failed to delete contact. Please try again." }));
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (showEditForm) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-lg max-w-md w-full">
                    <EditContactForm
                        profileId={profileId}
                        contact={contact}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditForm(false)}
                        editContact={editContact}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={name}
                    isDeleting={isDeleting}
                    message="delete-contact-message"
                />
            )}
            <div className="flex items-center justify-between py-4 border-b border-gray-100 group">
                <div className="flex items-center gap-3">
                    <ContactAvatar
                        name={name}
                        profilePicture={Profile.profilePicture ?? ""}
                        color={themeColor}
                    />
                    <div>
                        <h3 className="font-medium">{name}</h3>
                        {hasPositionOrCompany && (
                            <p className="text-sm text-gray-500">
                                {position}
                                {position && companyName ? " at " : ""}
                                {companyName}
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute end-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-primary p-1 hover:text-gray-600 rounded-full cursor-pointer">
                                    <MoreVertical size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="bg-white dark:bg-background">
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => setShowEditForm(true)}
                                >
                                    <Edit size={14} />
                                    <FormattedMessage id="edit" />
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center gap-2 text-red-500 cursor-pointer"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash2 size={14} />
                                    <FormattedMessage id="delete" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </>
    );
}