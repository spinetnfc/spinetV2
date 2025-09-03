"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog/dialog"
import EditContactForm from "../edit-contact-form"
import type { Contact } from "@/types/contact"
import PhoneMockup from "../contact-details"

interface ContactsModalsProps {
  selectedContact: Contact | null
  editingContact: Contact | null
  showInModal: boolean
  onContactClose: () => void
  onEditClose: () => void
  onEditSuccess: () => void
}

export function ContactsModals({
  selectedContact,
  editingContact,
  showInModal,
  onContactClose,
  onEditClose,
  onEditSuccess,
}: ContactsModalsProps) {
  return (
    <>
      {/* Contact Details Modal */}
      <Dialog open={!!selectedContact && !editingContact && showInModal} onOpenChange={onContactClose}>
        <DialogContent   className="p-0 bg-transparent shadow-none border-none outline-none w-fit max-h-[80vh] overflow-y-auto [&>button]:hidden">
          <DialogTitle className="sr-only">Contact Details</DialogTitle>
          {selectedContact && <PhoneMockup contact={selectedContact} onClose={onContactClose} />}
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={!!editingContact && !selectedContact && showInModal} onOpenChange={onEditClose}>
        <DialogContent className="p-0 bg-transparent shadow-none border-none outline-none max-w-md [&>button]:hidden">
          <DialogTitle className="sr-only">Edit Contact</DialogTitle>
          {editingContact && (
            <EditContactForm contact={editingContact} onSuccess={onEditSuccess} onCancel={onEditClose} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
