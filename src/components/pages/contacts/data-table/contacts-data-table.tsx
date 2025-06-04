"use client"

import React from "react"
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
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import { removeContacts, removeContact, editContact } from "@/actions/contacts"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { ContactFilterTabs } from "./contact-filter-tabs"
import { ContactSortDropdown } from "./contact-sort-dropdown"
import { contactColumns } from "./contact-columns"
import EditContactForm from "../edit-contact-form"
import type { Contact } from "@/types/contact"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"

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

// Hook to detect screen size
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 640) // sm breakpoint is 640px
        }

        checkIsMobile()
        window.addEventListener("resize", checkIsMobile)

        return () => window.removeEventListener("resize", checkIsMobile)
    }, [])

    return isMobile
}

// Move ActionCell outside to avoid hook issues
function ActionCell({
    contact,
    locale,
    profileId,
}: { contact: Contact; locale: string; profileId: string | undefined }) {
    const router = useRouter()
    const intl = useIntl()
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [showEditModal, setShowEditModal] = React.useState(false)
    const handleDeleteConfirm = async () => {
        if (!profileId) return

        try {
            setIsDeleting(true)
            const response = await removeContact(profileId, contact._id)

            if (response.success) {
                toast.success(intl.formatMessage({ id: "Contact deleted successfully" }))
                router.refresh()
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.error("Error deleting contact:", error)
            toast.error(intl.formatMessage({ id: "Failed to delete contact. Please try again." }))
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowEditModal(true)
    }


    return (
        <>
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={contact.name}
                    isDeleting={isDeleting}
                    message="delete-contact-message"
                />
            )}
            {showEditModal && (
                <EditContactForm
                    contact={contact}
                    onSuccess={() => { setShowEditModal(false) }}
                    onCancel={() => setShowEditModal(false)}
                />
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditClick}>
                        <Edit className="mr-2 h-4 w-4" />
                        <FormattedMessage id="edit" defaultMessage="Edit" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e: any) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowDeleteModal(true)
                        }}
                        className="text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <FormattedMessage id="delete" defaultMessage="Delete" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
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
    const isMobile = useIsMobile()

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
                return contactsToSort // Original order (date-desc)
            case "date-desc":
                return contactsToSort.reverse() // Reverse order (date-asc)
            case "name-asc":
            default:
                return contactsToSort.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        }
    }, [filteredByTypeContacts, sort])

    // Configure columns with theme color
    const allColumns = React.useMemo(() => contactColumns({ themeColor, locale }), [themeColor, locale])

    // Don't filter columns - instead use columnVisibility to hide them
    // This ensures the column structure stays consistent
    const columns = allColumns

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
            columnVisibility: {
                ...columnVisibility,
                // Hide company and position columns on mobile
                company: !isMobile,
                position: !isMobile,
            },
            rowSelection,
        },
    })

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
            <div className="rounded-md border overflow-x-auto ">
                <Table className="sm:table-fixed table-auto relative">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className={`px-2 ${header.column.id === "select" ? "w-10" : ""}`}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                                <TableHead className="w-12 absolute top-1.5 end-[104px]">
                                    <ContactSortDropdown themeColor={themeColor} />
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`p-2 min-w-0 ${cell.column.id === "select"
                                                ? "w-10"
                                                : cell.column.id === "name"
                                                    ? "w-auto"
                                                    : "max-w-[120px] sm:max-w-none truncate"
                                                }`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    {/* Actions cell outside of the column system */}
                                    <TableCell className="p-2 w-12">
                                        <ActionCell contact={row.original} locale={locale} profileId={profileId} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
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
