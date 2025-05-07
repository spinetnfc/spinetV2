"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { FormattedMessage } from "react-intl"

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemName: string
    isDeleting: boolean
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isDeleting,
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-background rounded-lg max-w-md w-full p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold"><FormattedMessage id="delete" /> {itemName}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-600 mb-6">
                    <FormattedMessage id="delete-link-message" />
                </p>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    {isDeleting ? <Button type="submit" disabled={isDeleting} variant={"destructive"}>
                        <FormattedMessage id="deleting" />
                    </Button> : <Button type="button" onClick={onConfirm} variant={"destructive"}>
                        <FormattedMessage id="delete" />
                    </Button>
                    }
                </div>
            </div>
        </div >
    )
}
