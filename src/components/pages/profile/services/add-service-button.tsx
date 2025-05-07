"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddServiceForm from "./add-service-form"
import type { ProfileData } from "@/lib/api/profile"

interface AddServiceButtonProps {
    profileId: string
    profileData: ProfileData
    buttonText?: string
}

export default function AddServiceButton({
    profileId,
    profileData,
    buttonText = "Add Service",
}: AddServiceButtonProps) {
    const [showAddForm, setShowAddForm] = useState(false)

    const handleSuccess = () => {
        setShowAddForm(false)
        window.location.reload()
    }

    return (
        <>
            <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1"
                style={{ backgroundColor: profileData.theme?.color }}
            >
                <Plus size={16} />
                {buttonText}
            </Button>

            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg max-w-md w-full">
                        <AddServiceForm
                            profileId={profileId}
                            onSuccess={handleSuccess}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
