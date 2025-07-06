"use client";

import { Edit, MoreVertical, Trash2 } from "lucide-react";
import ContactAvatar from "./contact-avatar";
import type { Contact } from "@/types/contact";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { useState, useEffect } from "react";
import EditContactForm from "./edit-contact-form";
import ConfirmationModal from "@/components/delete-confirmation-modal";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { removeContact } from "@/actions/contacts";
import { getFile } from "@/actions/files";

type ContactItemProps = {
    contact: Contact;
    locale: string;
    onDelete: (contactId: string) => void;
};

export default function ContactItem({ contact, locale, onDelete }: ContactItemProps) {
    const profileId = useAuth().user.selectedProfile;
    const [showEditForm, setShowEditForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [imageUrl, setImageUrl] = useState("/img/user.png"); // Default fallback
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
            const response = await removeContact(profileId, contactId);
            if (response.success) {
                toast.success(intl.formatMessage({ id: "Contact deleted successfully" }));
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error(intl.formatMessage({ id: "Failed to delete contact. Please try again." }));
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            onDelete(contactId);
        }
    };

    if (showEditForm) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-lg max-w-md w-full">
                    <EditContactForm
                        contact={contact}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditForm(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={name}
                    isDeleting={isDeleting}
                    message="delete-contact-message"
                />
            )}
            {/* <Link href={`/${locale}/public-profile/${contact.Profile._id}`} className="flex items-center justify-between py-4 border-b border-gray-100 group"> */}
            <div className="flex items-center gap-3">
                <ContactAvatar
                    name={name}
                    profilePicture={Profile.profilePicture ?? null}
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
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                                className="text-primary p-1 hover:text-gray-600 rounded-full cursor-pointer"
                            >
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
            {/* </Link> */}
        </>
    );
}