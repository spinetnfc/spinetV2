"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    type ColumnFiltersState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import { removeContacts } from "@/actions/contacts"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { ContactFilterTabs } from "./contact-filter-tabs"
import { ContactSortDropdown } from "./contact-sort-dropdown"
import { contactColumns } from "./contact-columns"
import type { Contact } from "@/types/contact"

interface ContactsDataTableProps {
    contacts: Contact[]
    themeColor: string
    locale: string
    searchParams: {
        query?: string
        filter?: string
        sort?: string
    }
}

export function ContactsDataTable({ contacts, themeColor, locale, searchParams }: ContactsDataTableProps) {
    const { query = "", filter = "all", sort = "name-asc" } = searchParams
    const router = useRouter()
    const pathname = usePathname()
    const urlSearchParams = useSearchParams()
    const profileId = useAuth().user?.selectedProfile
    const intl = useIntl()

    const [isDeleting, setIsDeleting] = React.useState(false)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

    // Apply initial filtering based on URL params
    const initialFiltering: ColumnFiltersState = []
    if (query) {
        initialFiltering.push({ id: "name", value: query })
    }
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFiltering)

    // Filter contacts based on type
    const filteredByTypeContacts = React.useMemo(() => {
        if (filter === "all") return contacts

        return contacts.filter((contact) => {
            if ("id" in contact.Profile) return false // Skip id-only profiles for type filtering
            return contact.type === filter
        })
    }, [contacts, filter])

    // Apply sorting based on URL params
    const sortedContacts = React.useMemo(() => {
        const contactsToSort = [...filteredByTypeContacts]

        switch (sort) {
            case "name-desc":
                return contactsToSort.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
            case "date-asc":
                return contactsToSort // Original order (oldest first)
            case "date-desc":
                return contactsToSort.reverse() // Reverse order (newest first)
            case "name-asc":
            default:
                return contactsToSort.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        }
    }, [filteredByTypeContacts, sort])

    // Update URL when filtering changes
    React.useEffect(() => {
        const params = new URLSearchParams(urlSearchParams.toString())

        // Update search query param
        const searchValue = columnFilters.find((filter) => filter.id === "name")?.value as string
        if (searchValue) {
            params.set("query", searchValue)
        } else {
            params.delete("query")
        }

        // Only update URL if params have changed
        const newParamsString = params.toString()
        const currentParamsString = urlSearchParams.toString()
        if (newParamsString !== currentParamsString) {
            router.replace(`${pathname}?${newParamsString}`, { scroll: false })
        }
    }, [columnFilters, pathname, router, urlSearchParams])

    // Configure columns with theme color
    const columns = React.useMemo(() => contactColumns({ themeColor, locale }), [themeColor, locale])

    // Set up the table
    const table = useReactTable({
        data: sortedContacts,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (!profileId) return

        try {
            setIsDeleting(true)
            const selectedRows = Object.keys(rowSelection)
                .filter((index) => rowSelection[index as any])
                .map((index) => sortedContacts[Number.parseInt(index)]._id)

            const response = await removeContacts(profileId, selectedRows)

            if (response.success) {
                toast.success(intl.formatMessage({ id: "Contacts deleted successfully" }))
                // Refresh the page to get updated data
                router.refresh()
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.error("Error deleting contacts:", error)
            toast.error(intl.formatMessage({ id: "Failed to delete contacts. Please try again." }))
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    // Get the count of selected rows
    const selectedRowCount = Object.values(rowSelection).filter(Boolean).length

    return (
        <div className="space-y-4">
            {/* Search and filter section */}
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-xl mb-2">
                        <FormattedMessage id="search" defaultMessage="Search" />
                    </h2>
                    <Input
                        placeholder={intl.formatMessage({ id: "search-contacts", defaultMessage: "Search contacts..." })}
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <div>
                    <h2 className="text-xl mb-2">
                        <FormattedMessage id="filter" defaultMessage="Filter" />
                    </h2>
                    <div className="flex items-center gap-4">
                        <ContactFilterTabs themeColor={themeColor} />
                        <ContactSortDropdown themeColor={themeColor} />
                    </div>
                </div>
            </div>

            {/* Add contact button and bulk actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {selectedRowCount > 0 && (
                        <Button
                            onClick={() => setShowDeleteModal(true)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={isDeleting}
                        >
                            <Trash2 size={16} />
                            <FormattedMessage id="delete" defaultMessage="Delete" /> ({selectedRowCount})
                        </Button>
                    )}
                </div>

                <Button asChild className="flex items-center gap-1" style={{ backgroundColor: themeColor }}>
                    <Link href="./contacts/add-contact">
                        <Plus size={16} />
                        <FormattedMessage id="add-contact" defaultMessage="Add contact" />
                    </Link>
                </Button>
            </div>

            {/* Data table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <FormattedMessage id="no-contacts-found" defaultMessage="No contacts found" />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <FormattedMessage id="previous" defaultMessage="Previous" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <FormattedMessage id="next" defaultMessage="Next" />
                </Button>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleBulkDelete}
                    itemName={"contacts"}
                    isDeleting={isDeleting}
                    message="delete-contacts-message"
                />
            )}
        </div>
    )
}
