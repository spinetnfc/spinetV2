"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { toast } from "sonner"
import { FormattedMessage, useIntl } from "react-intl"
import { ServiceInput } from "@/types/services"
import { addServiceAction } from "@/actions/services"

type AddServiceFormProps = {
    profileId: string
    onSuccess: () => void
    onCancel: () => void
}

export default function AddServiceForm({ profileId, onSuccess, onCancel }: AddServiceFormProps) {
    const { formatMessage } = useIntl()
    const [newService, setNewService] = useState<ServiceInput>({
        name: "",
        description: "",
    })
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!newService.name || !newService.description) {
            toast.error(formatMessage({ id: "Please fill in all required fields" }))
            return
        }

        startTransition(async () => {
            const result = await addServiceAction(profileId, newService)

            if (result.success) {
                toast.success(formatMessage({ id: "Service added successfully" }))
                onSuccess()
            } else {
                toast.error(formatMessage({ id: "Failed to add service. Please try again." }))
                console.error("addServiceAction failed:", result.error)
            }
        })
    }

    return (
        <div className="rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold"><FormattedMessage id="add-service" /></h3>
                <button onClick={onCancel} className="text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="serviceName"><FormattedMessage id="service-name" /></Label>
                    <Input
                        id="serviceName"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder={formatMessage({ id: "e.g. Web Development", defaultMessage: "e.g. Web Development" })}
                    />
                </div>

                <div>
                    <Label htmlFor="serviceDescription"><FormattedMessage id="description" /></Label>
                    <Textarea
                        id="serviceDescription"
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        placeholder={formatMessage({ id: "describe-service", defaultMessage: "Describe your service" })}
                        className="min-h-[100px]"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        <FormattedMessage id={isPending ? "saving" : "save"} />
                    </Button>
                </div>
            </form>
        </div>
    )
}
