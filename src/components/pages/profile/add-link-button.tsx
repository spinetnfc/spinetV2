"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddLinkForm from "./add-link-form"
import type { ProfileData } from "@/lib/api/profile"
import { Form } from "react-hook-form"
import { FormattedMessage } from "react-intl"

export default function AddLinkButton({ profileId, profileData }: { profileId: string; profileData: ProfileData }) {
    const [showAddLinkForm, setShowAddLinkForm] = useState(false)

    const handleSuccess = () => {
        setShowAddLinkForm(false)
        // Refresh the page to show the updated links
        window.location.reload()
    }

    return (
        <>
            <Button size="sm"
                onClick={() => setShowAddLinkForm(true)}
                className="flex items-center gap-1"
                style={{ backgroundColor: profileData.theme?.color }}
            >
                <Plus size={16} />
                <FormattedMessage id="add-link" defaultMessage="Add Link" />
            </Button>

            {showAddLinkForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg max-w-md w-full">
                        <AddLinkForm
                            profileId={profileId}
                            existingLinks={profileData.links}
                            onSuccess={handleSuccess}
                            onCancel={() => setShowAddLinkForm(false)}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
