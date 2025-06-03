"use client"

import type React from "react"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { FormattedMessage } from "react-intl"
import Link from "next/link"
import ContactAvatar from "./contact-avatar"
import type { Contact } from "@/types/contact"
import { useState } from "react"
import { useAuth } from "@/context/authContext"
import { removeContact } from "@/actions/contacts"
import { toast } from "sonner"
import { useIntl } from "react-intl"
import { useRouter } from "next/navigation"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"

interface ContactColumnsProps {
    themeColor: string
    locale: string
}

export const contactColumns = ({ themeColor, locale }: ContactColumnsProps): ColumnDef<Contact>[] => {
    // We need to use a function component for the cell to use React hooks
    const ActionCell = ({ row }: { row: any }) => {
        const contact = row.original
        const router = useRouter()
        const profileId = useAuth().user?.selectedProfile
        const intl = useIntl()
        const [isDeleting, setIsDeleting] = useState(false)
        const [showDeleteModal, setShowDeleteModal] = useState(false)

        const handleDeleteConfirm = async () => {
            if (!profileId) return

            try {
                setIsDeleting(true)
                const response = await removeContact(profileId, contact._id)

                if (response.success) {
                    toast.success(intl.formatMessage({ id: "Contact deleted successfully" }))
                    router.refresh()
                } else {
                    throw new Error(response.message)
                }
            } catch (error) {
                console.error("Error deleting contact:", error)
                toast.error(intl.formatMessage({ id: "Failed to delete contact. Please try again." }))
            } finally {
                setIsDeleting(false)
                setShowDeleteModal(false)
            }
        }

        const handleEditClick = (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(`/${locale}/contacts/edit-contact/${contact._id}`)
        }

        return (
            <>
                {showDeleteModal && (
                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteConfirm}
                        itemName={contact.name}
                        isDeleting={isDeleting}
                        message="delete-contact-message"
                    />
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleEditClick}>
                            <Edit className="mr-2 h-4 w-4" />
                            <FormattedMessage id="edit" defaultMessage="Edit" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowDeleteModal(true)
                            }}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <FormattedMessage id="delete" defaultMessage="Delete" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        )
    }

    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: () => <FormattedMessage id="contact" defaultMessage="Contact" />,
            cell: ({ row }) => {
                const contact = row.original
                const name = contact.name || "Unnamed Contact"
                const Profile = contact.Profile || {}
                const email = contact.Profile?.links?.find((link) => link.title.toLowerCase() === "email")?.link || ""

                return (
                    <Link href={`/${locale}/public-profile/${contact.Profile._id}`} className="flex items-center gap-3">
                        <ContactAvatar name={name} profilePicture={Profile.profilePicture ?? ""} color={themeColor} />
                        <div>
                            <div className="font-medium">{name}</div>
                            {email && <div className="text-sm text-muted-foreground lowercase">{email}</div>}
                        </div>
                    </Link>
                )
            },
            filterFn: (row, id, value) => {
                const contact = row.original
                const searchValue = value.toLowerCase()
                const name = contact.name?.toLowerCase() || ""
                const email =
                    contact.Profile?.links?.find((link) => link.title.toLowerCase() === "email")?.link?.toLowerCase() || ""
                const Profile = contact.Profile || {}
                const companyName = typeof Profile.companyName === "string" ? Profile.companyName.toLowerCase() : ""
                const position = typeof Profile.position === "string" ? Profile.position.toLowerCase() : ""

                return (
                    name.includes(searchValue) ||
                    email.includes(searchValue) ||
                    companyName.includes(searchValue) ||
                    position.includes(searchValue)
                )
            },
        },
        {
            accessorKey: "company",
            header: () => <FormattedMessage id="company" defaultMessage="Company" />,
            cell: ({ row }) => {
                const contact = row.original
                const Profile = contact.Profile || {}
                const companyName = typeof Profile.companyName === "string" ? Profile.companyName.trim() : ""
                return <div>{companyName || "-"}</div>
            },
        },
        {
            accessorKey: "position",
            header: () => <FormattedMessage id="position" defaultMessage="Position" />,
            cell: ({ row }) => {
                const contact = row.original
                const Profile = contact.Profile || {}
                const position = typeof Profile.position === "string" ? Profile.position.trim() : ""
                return <div>{position || "-"}</div>
            },
        },
        {
            id: "actions",
            header: () => <FormattedMessage id="actions" defaultMessage="Actions" />,
            cell: ActionCell,
        },
    ]
}
