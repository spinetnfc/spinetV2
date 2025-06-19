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
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import { removeContacts, removeContact } from "@/actions/contacts"
import ConfirmationModal from "@/components/delete-confirmation-modal"
import { ContactFilters } from "./contact-filters"
import { ContactSortDropdown } from "./contact-sort-dropdown"
import { contactColumns } from "./contact-columns"
import EditContactForm from "../edit-contact-form"
import type { Contact } from "@/types/contact"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { PaginationControls } from "@/components/ui/table-pagination"
import { TableFooter } from "@/components/ui/table"

interface ContactsDataTableProps {
    contacts: Contact[]
    locale: string
    searchParams: {
        query?: string
        filter?: string
        sort?: string
        page?: string
    }
}

function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 640)
        }

        checkIsMobile()
        window.addEventListener("resize", checkIsMobile)

        return () => window.removeEventListener("resize", checkIsMobile)
    }, [])

    return isMobile
}

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
                <ConfirmationModal
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
                    onSuccess={() => setShowEditModal(false)}
                    onCancel={() => setShowEditModal(false)}
                />
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditClick}>
                        <Edit className="me-2 h-4 w-4" />
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
                        <Trash2 className="me-2 h-4 w-4" />
                        <FormattedMessage id="delete" defaultMessage="Delete" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export function ContactsDataTable({ contacts, locale, searchParams }: ContactsDataTableProps) {
    const { query = "", filter = "all", sort = "name-asc", page = "1" } = searchParams
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

    const initialFiltering: ColumnFiltersState = []
    if (query) {
        initialFiltering.push({ id: "name", value: query })
    }
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFiltering)

    const filteredByTypeContacts = React.useMemo(() => {
        if (filter === "all") return contacts
        return contacts.filter((contact) => {
            if ("id" in contact.Profile) return false
            return contact.type === filter
        })
    }, [contacts, filter])

    const sortedContacts = React.useMemo(() => {
        const contactsToSort = [...filteredByTypeContacts]
        switch (sort) {
            case "name-desc":
                return contactsToSort.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
            case "date-asc":
                return contactsToSort
            case "date-desc":
                return contactsToSort.reverse()
            case "name-asc":
            default:
                return contactsToSort.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        }
    }, [filteredByTypeContacts, sort])

    const allColumns = React.useMemo(() => contactColumns(locale), [locale])
    const columns = allColumns

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
                company: !isMobile,
                position: !isMobile,
            },
            rowSelection,
            pagination: {
                pageIndex: Number(page) - 1,
                pageSize: 10,
            },
        },
    })

    React.useEffect(() => {
        const params = new URLSearchParams(urlSearchParams.toString())
        const searchValue = columnFilters.find((filter) => filter.id === "name")?.value as string
        if (searchValue) {
            params.set("query", searchValue)
        } else {
            params.delete("query")
        }
        const currentPage = table.getState().pagination.pageIndex + 1
        params.set("page", currentPage.toString())
        const newParamsString = params.toString()
        const currentParamsString = urlSearchParams.toString()
        if (newParamsString !== currentParamsString) {
            router.replace(`${pathname}?${newParamsString} `, { scroll: false })
        }
    }, [columnFilters, table.getState().pagination.pageIndex, pathname, router, urlSearchParams])

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
            setRowSelection({})
        }
    }

    const selectedRowCount = Object.values(rowSelection).filter(Boolean).length

    return (
        <div className="space-y-2 sm:space-y-4 sm:mt-4">

            <div className="flex flex-col-reverse xs:flex-row items-center justify-between gap-2">
                <div className="me-auto">
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
                <div className="ms-auto flex items-center gap-2">
                    <div className="flex gap-4 items-center border-1 border-gray-300 dark:border-azure w-fit rounded-lg">
                        <Input
                            placeholder={intl.formatMessage({ id: "search-contacts", defaultMessage: "Search contacts..." })}
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                            className="max-w-sm border-none min-w-60 sm:min-w-80"
                        />
                        <ContactFilters />
                    </div>
                    <Button asChild className="flex items-center h-10 gap-1 bg-azure">
                        <Link href="./contacts/add-contact">
                            <Plus size={16} />
                            <FormattedMessage id="add-contact" defaultMessage="Add contact" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bordr-gray-300 overflow-x-auto">
                <Table className="table-auto relative">
                    <TableHeader className="bg-gray-100 dark:bg-navy">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className={`px-4 font-normal ${header.column.id === "select" ? "w-fit" : ""} `}>
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`px-4 min-w-0 ${cell.column.id === "select"
                                                ? "w-fit"
                                                : cell.column.id === "name"
                                                    ? "w-auto truncate"
                                                    : " truncate"
                                                } `}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell className="px-4 w-12">
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
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={100} className="p-2 bg-gray-100 dark:bg-navy">
                                <PaginationControls
                                    currentPage={table.getState().pagination.pageIndex + 1}
                                    totalPages={table.getPageCount()}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>



            {showDeleteModal && (
                <ConfirmationModal
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