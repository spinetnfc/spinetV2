"use client"

import { Plus } from "lucide-react"

interface AddContactButtonProps {
    themeColor: string
}

export default function AddContactButton({ themeColor }: AddContactButtonProps) {
    return (
        <button
            className="flex items-center gap-2 font-medium"
            style={{ color: themeColor }}
            onClick={() => alert("Add contact functionality would go here")}
        >
            <Plus size={20} />
            Add contact
        </button>
    )
}
