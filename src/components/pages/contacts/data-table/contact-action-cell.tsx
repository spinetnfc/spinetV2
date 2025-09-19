"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import ConfirmationModal from "@/components/delete-confirmation-modal"
import { useContactsActions } from "@/store/contacts-store"
import type { Contact } from "@/types/contact"

interface ContactActionCellProps {
  contact: Contact
  locale: string
  profileId: string | undefined
  onEdit: () => void
}

export function ContactActionCell({ contact, locale, profileId, onEdit }: ContactActionCellProps) {
  const router = useRouter()
  const intl = useIntl()
  const { deleteContact } = useContactsActions()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteConfirm = async () => {
    if (!profileId) return

    try {
      setIsDeleting(true)

      // Use context to delete contact
      deleteContact(contact._id)

      toast.success(intl.formatMessage({ id: "Contact deleted successfully" }))
      // router.refresh() - not needed with context
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
    onEdit()
  }

  return (
    <>
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          itemName={contact.Profile.fullName}
          isDeleting={isDeleting}
          messageId="delete-contact-message"
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="me-2 h-4 w-4" />
            <FormattedMessage id="edit" defaultMessage="Edit" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e: any) => {
              e.preventDefault()
              e.stopPropagation()
              setShowDeleteModal(true)
            }}
            className="text-red-600"
          >
            <Trash2 className="me-2 h-4 w-4" />
            <FormattedMessage id="delete" defaultMessage="Delete" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
