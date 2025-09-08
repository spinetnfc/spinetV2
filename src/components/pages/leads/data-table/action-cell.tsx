"use client"
import { removeLead } from "@/actions/leads";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { Lead } from "@/types/leads";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { toast } from "sonner";
import { UpdateLeadStatusDialog } from "../update-lead-status-dialog";
import ConfirmationModal from "@/components/delete-confirmation-modal"

export default function ActionCell({
    lead,
    locale,
    profileId,
    setRefreshKey,
}: { lead: Lead; locale: string; profileId: string | undefined; setRefreshKey: React.Dispatch<React.SetStateAction<number>> }) {
    const router = useRouter()
    const intl = useIntl()
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [showStatusDialog, setShowStatusDialog] = React.useState(false)

    const handleDeleteConfirm = async () => {
        if (!profileId) return
        try {
            setIsDeleting(true)
            const response = await removeLead(profileId, lead._id)
            if (response.success) {
                toast.success(intl.formatMessage({ id: "Lead deleted successfully" }))
                setRefreshKey(k => k + 1);
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.error("Error deleting lead:", error)
            toast.error(intl.formatMessage({ id: "Failed to delete lead. Please try again." }))
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const handleStatusClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowStatusDialog(true);
    }

       
    return (
        <>
            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={lead.name}
                    isDeleting={isDeleting}
                    messageId="delete-lead-message"
                />
            )}
            <UpdateLeadStatusDialog
                open={showStatusDialog}
                onOpenChange={setShowStatusDialog}
                lead={{ ...lead, status: lead.status ?? "pending" }}
                onStatusUpdated={() => router.refresh()}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleStatusClick}>
                        <Edit className="me-2 h-4 w-4" />
                        <FormattedMessage id="edit-status" defaultMessage="Edit Status" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e: any) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowDeleteModal(true)
                        }}
                        className="text-red-600"
                    >
                        <Trash2 className="me-2 h-4 w-4" />
                        <FormattedMessage id="delete" defaultMessage="Delete" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}