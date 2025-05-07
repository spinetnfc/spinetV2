"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { updateProfile } from "@/lib/api/profile"
import { toast } from "sonner"

type ServiceType = {
    name: string
    description: string
}

type EditServiceFormProps = {
    onSuccess: () => void
    onCancel: () => void
}

export default function EditServiceForm({
    onSuccess,
    onCancel,
}: EditServiceFormProps) {
    const [editedService, setEditedService] = useState<ServiceType>({
        name: "",
        description: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!editedService.name || !editedService.description) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            setIsSubmitting(true)
            onSuccess()
        } catch (error) {
            console.error("Error updating service:", error)
            toast.error("Failed to update service. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-navy rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Service</h3>
                <button onClick={onCancel} className="text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input
                        id="serviceName"
                        value={editedService.name}
                        onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                        placeholder="e.g. Web Development"
                    />
                </div>

                <div>
                    <Label htmlFor="serviceDescription">Description</Label>
                    <Textarea
                        id="serviceDescription"
                        value={editedService.description}
                        onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                        placeholder="Describe your service..."
                        className="min-h-[100px]"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Service"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
