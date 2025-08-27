"use client"

import { flexRender, type Table as ReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table/table"
import { FormattedMessage } from "react-intl"
import { cn } from "@/utils/cn"
import { ContactSortDropdown } from "./contact-sort-dropdown"
import { ContactActionCell } from "./contact-action-cell"
import { PaginationControls } from "@/components/ui/table-pagination"
import type { Contact } from "@/types/contact"

interface ContactsTableProps {
  table: ReactTable<Contact>
  selectedContact: Contact | null
  onContactSelect: (contact: Contact | null) => void
  onContactEdit: (contact: Contact) => void
  profileId: string | undefined
  locale: string
  contactsCount: number
  rowsPerPage: number
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
}: ContactsTableProps) {
  return (
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
                <FormattedMessage id="no-contacts-found" defaultMessage="No contacts found" />
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
  )
}
