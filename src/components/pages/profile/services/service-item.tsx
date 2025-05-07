"use client"

import { useState } from "react"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { toast } from "sonner"
import DeleteConfirmationModal from "./delete-confirmation-modal"
import EditServiceForm from "./edit-service-form"
import { Service } from "@/types/services"
import { deleteService } from "@/lib/api/services"

interface ServiceItemProps {
    service: Service
    profileId: string
    themeColor: string
}

export default function ServiceItem({ profileId, service, themeColor }: ServiceItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleDeleteClick = () => {
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true)
            const response = await deleteService(profileId, service._id)
            toast.success("Service deleted successfully")
            window.location.reload()
        } catch (error) {
            console.error("Error deleting service:", error)
            toast.error("Failed to delete service. Please try again.")
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const handleEditSuccess = () => {
        setShowEditForm(false)
        toast.success("Service updated successfully")
        window.location.reload()
    }

    if (showEditForm) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-lg max-w-md w-full">
                    <EditServiceForm
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
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName="service"
                    isDeleting={isDeleting}
                />
            )}

            <div className="bg-blue-100 dark:bg-navy rounded-lg p-6 relative group">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-gray-500 p-1 hover:text-gray-700 bg-white/80 rounded-full">
                                <MoreVertical size={16} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setShowEditForm(true)}
                            >
                                <Edit size={14} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-500 cursor-pointer"
                                onClick={handleDeleteClick}
                            >
                                <Trash2 size={14} /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <h3 className="text-xl font-bold mb-2 capitalize" style={{ color: themeColor }}>
                    {service.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
            </div>
        </>
    )
}
