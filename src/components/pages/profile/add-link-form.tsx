"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { updateProfile } from "@/lib/api/profile"
import { toast } from "sonner"
import { FormattedMessage, useIntl } from "react-intl"

type LinkType = {
    name: string
    title: string
    link: string
}

type AddLinkFormProps = {
    profileId: string
    existingLinks: LinkType[]
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

export default function AddLinkForm({ profileId, existingLinks, onSuccess, onCancel }: AddLinkFormProps) {
    const { formatMessage } = useIntl()
    const [newLink, setNewLink] = useState<LinkType>({
        name: "",
        title: "",
        link: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const intl = useIntl()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newLink.name || !newLink.title) {
            toast.error(intl.formatMessage({ id: "Please fill in all required fields" }))
            return
        }

        try {
            setIsSubmitting(true)

            // Add the new link to existing links
            const updatedLinks = [...existingLinks, newLink]

            // Call the updateProfile function with the updated links
            await updateProfile(profileId, {
                links: updatedLinks,
            })

            toast.success(intl.formatMessage({ id: "Link added successfully" }))
            onSuccess()
        } catch (error) {
            console.error("Error adding link:", error)
            toast.error(intl.formatMessage({ id: "Failed to add link. Please try again." }))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className=" rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold"><FormattedMessage id="add-link" /></h3>
                <button onClick={onCancel} className="text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="linkType"><FormattedMessage id="link-type" /></Label>
                    <Select value={newLink.name} onValueChange={(value) => setNewLink({ ...newLink, name: value })}>
                        <SelectTrigger id="linkType" className="">
                            <SelectValue placeholder={formatMessage({ id: "select-link-type", defaultMessage: "Select link type" })}
                            />
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
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        placeholder={formatMessage({ id: "e.g. My Website, @username", defaultMessage: "e.g. My Website" })}
                    />
                </div>

                {newLink.name !== "email" && newLink.name !== "phone" && (
                    <div>
                        <Label htmlFor="linkUrl"><FormattedMessage id="url" /></Label>
                        <Input
                            id="linkUrl"
                            value={newLink.link || ""}
                            onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                            placeholder="https://"
                            type="url"
                        />
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    {isSubmitting ? <Button type="submit" disabled={isSubmitting}>
                        <FormattedMessage id="saving" />
                    </Button> : <Button type="button" onClick={onCancel}>
                        <FormattedMessage id="save" />
                    </Button>
                    }
                </div>
            </form>
        </div>
    )
}
