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
    const [newLink, setNewLink] = useState<LinkType>({
        name: "",
        title: "",
        link: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newLink.name || !newLink.title) {
            toast.error("Please fill in all required fields")
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

            toast.success("Link added successfully")
            onSuccess()
        } catch (error) {
            console.error("Error adding link:", error)
            toast.error("Failed to add link. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className=" rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Link</h3>
                <button onClick={onCancel} className="text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="linkType">Link Type</Label>
                    <Select value={newLink.name} onValueChange={(value) => setNewLink({ ...newLink, name: value })}>
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
                    <Label htmlFor="linkTitle">Display Text</Label>
                    <Input
                        id="linkTitle"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        placeholder="e.g. My Website, @username"
                    />
                </div>

                {newLink.name !== "email" && newLink.name !== "phone" && (
                    <div>
                        <Label htmlFor="linkUrl">URL</Label>
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
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Link"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
