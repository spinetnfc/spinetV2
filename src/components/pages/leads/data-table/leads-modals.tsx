"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog/dialog"
import type { Lead } from "@/types/leads"
import AddLeadForm from "../add-lead-form"
import { EditLeadPanel } from "./edit-lead"
import ConfirmationModal from "@/components/delete-confirmation-modal"
import { ExportDialogue } from "./export-dialogue"
import { FilterDialogue } from "./filter-dialogue"
import type { FilterState } from "@/types/leads"

interface LeadsModalsProps {
  // Add Lead Modal
  showAddLead: boolean
  onAddLeadClose: () => void
  onAddLeadSave: () => void
  locale: string

  // Edit Lead Modal
  selectedLeads: Lead[]
  onEditLeadClose: () => void
  onEditLeadSave: (updatedLead: Lead) => void

  // Delete Confirmation Modal
  showDeleteModal: boolean
  onDeleteModalClose: () => void
  onDeleteConfirm: () => void
  isDeleting: boolean

  // Export Modal
  showExportDialog: boolean
  onExportDialogClose: () => void

  // Filter Modal
  showAdvancedFilters: boolean
  onAdvancedFiltersClose: () => void
  onFiltersChange: (filters: FilterState) => void
  currentFilters: FilterState

  // Screen size check for modal vs sidebar display
  shouldShowAsModal: boolean
}

export function LeadsModals({
  showAddLead,
  onAddLeadClose,
  onAddLeadSave,
  locale,
  selectedLeads,
  onEditLeadClose,
  onEditLeadSave,
  showDeleteModal,
  onDeleteModalClose,
  onDeleteConfirm,
  isDeleting,
  showExportDialog,
  onExportDialogClose,
  showAdvancedFilters,
  onAdvancedFiltersClose,
  onFiltersChange,
  currentFilters,
  shouldShowAsModal,
}: LeadsModalsProps) {
  const selectedLead = selectedLeads.length === 1 ? selectedLeads[0] : null

  return (
    <>
      {/* Add Lead Modal - only show as modal on smaller screens */}
      {shouldShowAsModal && showAddLead && (
        <Dialog open={showAddLead} onOpenChange={onAddLeadClose}>
          <DialogContent className="p-0 bg-white shadow-none border-none outline-none max-w-sm [&>button]:hidden">
            <DialogTitle className="sr-only">Add Lead</DialogTitle>
            <AddLeadForm locale={locale} onSave={onAddLeadSave} onClose={onAddLeadClose} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Lead Modal - only show as modal on smaller screens */}
      {shouldShowAsModal && selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={onEditLeadClose}>
          <DialogContent className="p-0 bg-white shadow-none border-none outline-none max-w-sm [&>button]:hidden">
            <DialogTitle className="sr-only">Edit Lead</DialogTitle>
            <EditLeadPanel lead={selectedLead} onClose={onEditLeadClose} onSave={onEditLeadSave} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={onDeleteModalClose}
          onConfirm={onDeleteConfirm}
          itemName="leads"
          isDeleting={isDeleting}
          messageId="delete-leads-message"
        />
      )}

      {/* Export Dialog */}
      <ExportDialogue isOpen={showExportDialog} onClose={onExportDialogClose} leads={selectedLeads} />

      {/* Filter Dialog */}
      <FilterDialogue
        isOpen={showAdvancedFilters}
        onClose={onAdvancedFiltersClose}
        onFiltersChange={onFiltersChange}
        currentFilters={currentFilters}
      />
    </>
  )
}
