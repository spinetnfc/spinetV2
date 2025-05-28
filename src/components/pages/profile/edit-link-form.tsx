"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { updateProfileAction } from "@/actions/profile"
import { toast } from "sonner"
import { FormattedMessage, useIntl } from "react-intl"

type LinkType = {
    name: string
    title: string
    link: string
}

type EditLinkFormProps = {
    profileId: string
    existingLinks: LinkType[]
    linkIndex: number
    onSuccess: () => void
    onCancel: () => void
}

const LINK_TYPES = [
    "website",
    "linkedin",
    "instagram",
    "twitter",
    "github",
    "email",
    "phone",
    "facebook",
    "location",
    "order now",
    "play store",
    "app store",
    "whatsapp",
    "telegram",
    "viber",
    "other",
]

export default function EditLinkForm({ profileId, existingLinks, linkIndex, onSuccess, onCancel }: EditLinkFormProps) {
    const [editedLink, setEditedLink] = useState<LinkType | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const intl = useIntl()

    useEffect(() => {
        console.log("existingLinks:", existingLinks)
        console.log("linkIndex:", linkIndex)
        const linkToEdit = existingLinks[linkIndex]
        if (linkToEdit) {
            setEditedLink({
                name: linkToEdit.name || "",
                title: linkToEdit.title || "",
                link: linkToEdit.link || "",
            })
        } else {
            console.error("No link found at index:", linkIndex)
        }
    }, [existingLinks, linkIndex])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!editedLink || !editedLink.name || !editedLink.title) {
            toast.error(intl.formatMessage({ id: "Please fill in all required fields" }))
            return
        }

        try {
            setIsSubmitting(true)
            const updatedLinks = [...existingLinks]
            updatedLinks[linkIndex] = editedLink
            await updateProfileAction(profileId, { links: updatedLinks })
            onSuccess()
        } catch (error) {
            console.error("Error updating link:", error)
            toast.error(intl.formatMessage({ id: "Failed to update link. Please try again." }))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!editedLink) {
        return <div className="text-red-500">Link not found. Please try again.</div>
    }

    return (
        <div className="rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold"><FormattedMessage id="edit-link" /></h3>
                <button onClick={onCancel} className="text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="linkType"><FormattedMessage id="link-type" /></Label>
                    <Select value={editedLink.name} onValueChange={(value) => setEditedLink({ ...editedLink, name: value })}>
                        <SelectTrigger id="linkType">
                            <SelectValue placeholder="Select link type" />
                        </SelectTrigger>
                        <SelectContent>
                            {LINK_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="linkTitle"><FormattedMessage id="display-text" /></Label>
                    <Input
                        id="linkTitle"
                        value={editedLink.title}
                        onChange={(e) => setEditedLink({ ...editedLink, title: e.target.value })}
                        placeholder="e.g. My Website, @username"
                    />
                </div>

                {editedLink.name !== "email" && editedLink.name !== "phone" && (
                    <div>
                        <Label htmlFor="linkUrl"><FormattedMessage id="url" /></Label>
                        <Input
                            id="linkUrl"
                            value={editedLink.link || ""}
                            onChange={(e) => setEditedLink({ ...editedLink, link: e.target.value })}
                            placeholder="https://"
                            type="url"
                        />
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
                    </Button>
                </div>
            </form>
        </div>
    )
}