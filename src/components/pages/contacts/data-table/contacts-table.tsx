"use client"

import { flexRender, type Table as ReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { FormattedMessage } from "react-intl"
import { cn } from "@/lib/utils"
import { ContactSortDropdown } from "./contact-sort-dropdown"
import { ContactActionCell } from "./contact-action-cell"
import { PaginationControls } from "@/components/ui/table-pagination"
import type { Contact } from "@/types/contact"
import { ColumnCustomizationModal } from "./column-customization-modal"

interface ContactsTableProps {
  table: ReactTable<Contact>
  selectedContact: Contact | null
  onContactSelect: (contact: Contact | null) => void
  onContactEdit: (contact: Contact) => void
  profileId: string | undefined
  locale: string
  contactsCount: number
  rowsPerPage: number
  onColumnOrderChange?: (visibleColumns: string[], columnOrder: string[]) => void
  isColumnModalOpen: boolean
  setIsColumnModalOpen: (open: boolean) => void
}
const EmptyContactsState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
     <div> <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="4.5" y="4" width="48" height="48" rx="24" fill="#DBEAFE"/>
<rect x="4.5" y="4" width="48" height="48" rx="24" stroke="#EFF6FF" stroke-width="8"/>
<path d="M27.5 35C31.9183 35 35.5 31.4183 35.5 27C35.5 22.5817 31.9183 19 27.5 19C23.0817 19 19.5 22.5817 19.5 27C19.5 31.4183 23.0817 35 27.5 35Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M37.5004 36.9999L33.1504 32.6499" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
 <FormattedMessage id="no-contacts-found" defaultMessage="No contacts found" />   
 <p className="text-center text-gray-500 mt-2">There is nothing to display here yet.</p>
</div>
  )
}
export function ContactsTable({
  table,
  selectedContact,
  onContactSelect,
  onContactEdit,
  profileId,
  locale,
  contactsCount,
  rowsPerPage,
  onColumnOrderChange,
  isColumnModalOpen,
  setIsColumnModalOpen,
}: ContactsTableProps) {
  const availableColumns = [
    { id: "select", label: "Select", category: "primary" as const, required: true },
    { id: "name", label: "Contact", category: "primary" as const, required: true },
    { id: "source", label: "Source", category: "primary" as const },
    { id: "company", label: "Company", category: "primary" as const },
    { id: "position", label: "Position", category: "primary" as const },

  ]

  const currentVisibleColumns = table
    .getAllColumns()
    .filter((col) => col.getIsVisible())
    .map((col) => col.id)

  const currentColumnOrder = table.getAllColumns().map((col) => col.id)

  const handleColumnCustomizationSave = (visibleColumns: string[], columnOrder: string[]) => {
    if (onColumnOrderChange) {
      onColumnOrderChange(visibleColumns, columnOrder)
    } else {
      console.log(" Column order would be:", columnOrder)
      console.log("To enable reordering, pass onColumnOrderChange prop to ContactsTable")
    }
  }
if (contactsCount === 0) {
  return <EmptyContactsState />
}
  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table className="table-auto relative">
          <TableHeader className="bg-gray-100 dark:bg-navy">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`px-2 py-1 font-normal ${header.column.id === "select" ? "w-fit" : ""}`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
                <TableHead className="w-12 absolute top-1.5 end-4">
                  <ContactSortDropdown />
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (selectedContact?._id === row.original._id) {
                      onContactSelect(null)
                    } else {
                      onContactSelect(row.original)
                    }
                  }}
                  className={`cursor-pointer ${row.original._id === selectedContact?._id ? "bg-azure/50" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "min-w-0 h-14 max-h-14",
                        cell.column.id === "select"
                          ? "w-12 px-2"
                          : cell.column.id === "name"
                            ? "w-auto truncate px-2"
                            : "truncate px-2",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell className="px-2 w-12">
                    <ContactActionCell
                      contact={row.original}
                      locale={locale}
                      profileId={profileId}
                      onEdit={() => onContactEdit(row.original)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100} className="h-24 text-center">
                  <EmptyContactsState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={100} className="h-10 px-2 py-1 bg-gray-100 dark:bg-navy">
                <PaginationControls
                  currentPage={table.getState().pagination.pageIndex + 1}
                  totalPages={table.getPageCount()}
                  totalElements={contactsCount}
                  rowsPerPage={Number(rowsPerPage)}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <ColumnCustomizationModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        availableColumns={availableColumns}
        visibleColumns={currentVisibleColumns}
        columnOrder={currentColumnOrder}
        onSave={handleColumnCustomizationSave}
      />
    </>
  )
}
