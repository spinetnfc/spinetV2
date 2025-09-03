"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { FormattedMessage } from "react-intl"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  onConfirm: () => void
  itemName: string
  isDeleting: boolean
  messageId?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
  messageId,
}: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <FormattedMessage id="delete" /> {itemName}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <FormattedMessage
              id={messageId || "delete.confirm"}
              defaultMessage="Are you sure you want to delete this? This action cannot be undone."
              values={{ itemName }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            <FormattedMessage id="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <FormattedMessage id="deleting" />
            ) : (
              <FormattedMessage id="delete" />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
