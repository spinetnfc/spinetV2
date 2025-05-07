"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="rounded-lg max-w-md w-full p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Delete {itemName}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete this {itemName}? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div >
    )
}
