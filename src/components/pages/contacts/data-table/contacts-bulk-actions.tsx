"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import ConfirmationModal from "@/components/delete-confirmation-modal"
import { useContactsActions } from "@/lib/store/contacts-store"
import type { Contact } from "@/types/contact"

interface ContactsBulkActionsProps {
  selectedContacts: Contact[]
  profileId: string | undefined
  onSelectionClear: () => void
}

export function ContactsBulkActions({ selectedContacts, profileId, onSelectionClear }: ContactsBulkActionsProps) {
  const router = useRouter()
  const intl = useIntl()
  const { deleteContact } = useContactsActions()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleBulkDelete = async () => {
    if (!profileId) return

    try {
      setIsDeleting(true)
      const selectedIds = selectedContacts.map((contact) => contact._id)

      // Use context to delete multiple contacts
      selectedIds.forEach(id => deleteContact(id))

      toast.success(intl.formatMessage({ id: "Contacts deleted successfully" }))
      // router.refresh() - not needed with context
    } catch (error) {
      console.error("Error deleting contacts:", error)
      toast.error(intl.formatMessage({ id: "Failed to delete contacts. Please try again." }))
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      onSelectionClear()
    }
  }

  if (selectedContacts.length === 0) return null

  return (
    <>
      <div className="me-auto">
        <Button
          onClick={() => setShowDeleteModal(true)}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          <FormattedMessage id="delete" defaultMessage="Delete" /> ({selectedContacts.length})
        </Button>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleBulkDelete}
          itemName="contacts"
          isDeleting={isDeleting}
          messageId="delete-contacts-message"
        />
      )}
    </>
  )
}
