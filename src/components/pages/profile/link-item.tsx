"use client"

import type React from "react"
import { useState } from "react"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { updateProfileAction } from "@/actions/profile"
import type { ProfileData } from "@/types/profile"
import Link from "next/link"
import EditLinkForm from "./edit-link-form"
import ConfirmationModal from "@/components/delete-confirmation-modal"
import { toast } from "sonner"
import { FormattedMessage, useIntl } from "react-intl"
import { Card, CardContent } from "@/components/ui/card"

interface LinkItemProps {
    link: {
        name: string
        title: string
        link?: string
    }
    index: number
    profileId: string
    profileData: ProfileData
    themeColor: string
    icon: React.ReactNode
}

export default function LinkItem({ link, index, profileId, profileData, icon }: LinkItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const intl = useIntl()
    const isEmailOrPhone =
        link.name === "email" ||
        link.name === "phone" ||
        link.name === "whatsapp" ||
        link.name === "telegram" ||
        link.name === "viber"

    const isClickableLink = link.name !== "email" && link.name !== "phone" && link.link

    const getDisplayLabel = () =>
        !["email", "phone"].includes(link.name.toLowerCase()) ? link.title.charAt(0).toUpperCase() +
            link.title.slice(1) : link.name.charAt(0).toUpperCase() + link.name.slice(1)

    const handleDeleteClick = () => {
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true)

            const updatedLinks = profileData.links.filter((_, i) => i !== index)

            await updateProfileAction(profileId, {
                links: updatedLinks,
            })

            toast.success(intl.formatMessage({ id: "Link deleted successfully" }))
            window.location.reload()
        } catch (error) {
            console.error("Error deleting link:", error)
            toast.error(intl.formatMessage({ id: "Failed to delete link. Please try again." }))
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const handleEditSuccess = () => {
        setShowEditForm(false)
        toast.success(intl.formatMessage({ id: "Link updated successfully" }))
        window.location.reload()
    }

    if (showEditForm) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-lg max-w-md w-full">
                    <EditLinkForm
                        profileId={profileId}
                        existingLinks={profileData.links}
                        linkIndex={index}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditForm(false)}
                    />
                </div>
            </div>
        )
    }

    const getLinkContent = () => (
        <Card className="bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700 hover:bg-slate-750 relative group transition-colors">
            <CardContent className="p-4 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center justify-center text-blue-600">{icon}</div>
                <div className="ms-3 overflow-hidden flex-grow">
                    <span className="font-medium text-primary truncate block">{getDisplayLabel()}</span>
                    {isEmailOrPhone ? <p className="text-xs font-medium text-gray-400 truncate">{link.title}</p> :
                        <p className="text-xs font-medium text-gray-400 truncate">{link.link || ""}</p>}
                </div>
                <div className="absolute end-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => { e.preventDefault(), e.stopPropagation(); }}
                                className="text-primary p-1 hover:text-gray-600 rounded-full cursor-pointer">
                                <MoreVertical size={20} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white dark:bg-background"
                            onClick={(e) => { e.preventDefault(), e.stopPropagation(); }}
                        >
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    setShowEditForm(true)
                                }}
                            >
                                <Edit size={14} /> <FormattedMessage id="edit" defaultMessage="Edit" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-500 cursor-pointer"
                                onClick={() => {
                                    handleDeleteClick()
                                }}
                            >
                                <Trash2 size={14} /> <FormattedMessage id="delete" defaultMessage="Delete" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <>
            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={link.name}
                    isDeleting={isDeleting}
                    message="delete-link-message"
                />
            )}

            {isClickableLink ? (
                <Link href={link.link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full">
                    {getLinkContent()}
                </Link>
            ) : (
                <div className="w-full">{getLinkContent()}</div>
            )}
        </>
    )
}
