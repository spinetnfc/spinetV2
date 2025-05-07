"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { toast } from "sonner"
import type { Service, ServiceInput } from "@/types/services"
import { updateService } from "@/lib/api/services"
import { FormattedMessage } from "react-intl"

type EditServiceFormProps = {
    profileId: string
    service: Service
    onSuccess: () => void
    onCancel: () => void
}

export default function EditServiceForm({
    profileId,
    service,
    onSuccess,
    onCancel
}: EditServiceFormProps) {
    const [editedService, setEditedService] = useState<ServiceInput>(() => {
        const { _id, ...rest } = service;
        return rest;
    });
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!editedService.name || !editedService.description) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            setIsSubmitting(true)
            const respone = await updateService(profileId, service._id, editedService)
            console.log("Service updated response received:", respone)
            onSuccess()
        } catch (error) {
            console.error("Error updating service:", error)
            toast.error("Failed to update service. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold"><FormattedMessage id="edit-service" /></h3>
                <button onClick={onCancel} className="text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="serviceName"><FormattedMessage id="service-name" /></Label>
                    <Input
                        id="serviceName"
                        value={editedService.name}
                        onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                        placeholder="e.g. Web Development"
                    />
                </div>

                <div>
                    <Label htmlFor="serviceDescription"><FormattedMessage id="description" /></Label>
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
                        <FormattedMessage id="cancel" />
                    </Button>
                    {isSubmitting ?
                        <Button type="submit" disabled={isSubmitting}>
                            <FormattedMessage id="saving" />
                        </Button> : <Button type="submit" disabled={isSubmitting}>
                            <FormattedMessage id="save" />
                        </Button>
                    }
                </div>
            </form>
        </div>
    )
}
