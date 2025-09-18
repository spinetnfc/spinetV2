"use client"

import { useState } from "react"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { toast } from "sonner"
import ConfirmationModal from "@/components/delete-confirmation-modal"
import EditServiceForm from "./edit-service-form"
import { Service } from "@/types/services"
import { FormattedMessage, useIntl } from "react-intl"
import { Card, CardContent } from "@/components/ui/card"

interface ServiceItemProps {
    service: Service
    profileId: string
    themeColor: string
}

export default function ServiceItem({ profileId, service, themeColor }: ServiceItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const intl = useIntl()
    const handleDeleteClick = () => {
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true)
            // Mock delete service - replace with hardcoded behavior
            console.log("Mock delete service:", service._id);
            toast.success(intl.formatMessage({ id: "Service deleted successfully" }))
            window.location.reload()
        } catch (error) {
            console.error("Error deleting service:", error)
            toast.error(intl.formatMessage({ id: "Failed to delete service. Please try again." }))
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const handleEditSuccess = () => {
        setShowEditForm(false)
        toast.success(intl.formatMessage({ id: "Service updated successfully" })
        )
        window.location.reload()
    }

    if (showEditForm) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-lg max-w-md w-full">
                    <EditServiceForm
                        profileId={profileId}
                        service={service}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditForm(false)}
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName="service"
                    isDeleting={isDeleting}
                    messageId="delete-service-message"
                />
            )}

            <Card className="bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700 hover:bg-slate-750 relative group transition-colors">
                <CardContent className="p-4">
                    <div className="absolute end-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-primary p-1 hover:text-gray-600 rounded-full cursor-pointer">
                                    <MoreVertical size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="bg-white dark:bg-background">
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => setShowEditForm(true)}
                                >
                                    <Edit size={14} /> <FormattedMessage id="edit" />
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center gap-2 text-red-500 cursor-pointer"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash2 size={14} /> <FormattedMessage id="delete" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <h3 className="text-xl font-bold mb-2 capitalize" style={{ color: themeColor }}>
                        {service.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
                </CardContent>
            </Card>
        </>
    )
}
