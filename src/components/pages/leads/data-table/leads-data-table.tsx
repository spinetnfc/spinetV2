"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    type ColumnFiltersState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    CellContext,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreVertical, Edit, Trash2, Plus, CalendarIcon } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import { removeLead } from "@/actions/leads"
import ConfirmationModal from "@/components/delete-confirmation-modal"
import { LeadFilters } from "./lead-filters"
import { ContactSortDropdown } from "./lead-sort-dropdown"
import { leadColumns } from "./lead-columns"
import type { Lead } from "@/types/leads"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { LeadsPaginationControls } from "@/components/pages/leads/data-table/leads-pagination-controls"
import { TableFooter } from "@/components/ui/table"
import { cn } from "@/utils/cn"
import { useDynamicRowsPerPage } from "@/hooks/useDynamicRowsPerPage"
import { filterLeads } from "@/actions/leads"
import { getUserFromCookie } from "@/utils/cookie"
import { UpdateLeadStatusDialog } from "../update-lead-status-dialog";

interface LeadsDataTableProps {
    locale: string
    searchParams: {
        types?: string[];
        status?: Array<
            | "pending"
            | "prospecting"
            | "offer-sent"
            | "negotiation"
            | "administrative-validation"
            | "done"
            | "failed"
            | "canceled">;
        priority?: Array<"none" | "low" | "medium" | "high" | "critical">;
        lifeTime?: {
            begins: {
                start: string;
                end: string;
            };
            ends: {
                start: string;
                end: string;
            };
        };
        tags?: string[];
        contacts?: string[];
        search?: string
        sort?: string
        page?: string
        rowsPerPage?: string
    }
}

function useisSmallScreen() {
    const [isSmallScreen, setisSmallScreen] = React.useState(false)

    React.useEffect(() => {
        const checkisSmallScreen = () => {
            setisSmallScreen(window.innerWidth < 1280)
        }

        checkisSmallScreen()
        window.addEventListener("resize", checkisSmallScreen)

        return () => window.removeEventListener("resize", checkisSmallScreen)
    }, [])

    return isSmallScreen
}

function ActionCell({
    lead,
    locale,
    profileId,
}: { lead: Lead; locale: string; profileId: string | undefined }) {
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
                router.refresh()
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
                    message="delete-lead-message"
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
                    <DropdownMenuItem onClick={() => { }}>
                        <Plus className="me-2 h-4 w-4" />
                        <FormattedMessage id="add-note" defaultMessage="Add Note" />
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

export function LeadsDataTable({ locale, searchParams }: LeadsDataTableProps) {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(false)

    const dynamicRowsPerPage = useDynamicRowsPerPage(5, 20) // Min 5, Max 50

    const {
        search = "",
        types,
        priority,
        lifeTime,
        tags,
        contacts,
        page = "1",
        rowsPerPage
    } = searchParams
    // Always treat status as an array
    const status = Array.isArray(searchParams.status)
        ? searchParams.status
        : searchParams.status
            ? [searchParams.status]
            : []
    const currentRowsPerPage = Number(rowsPerPage) || dynamicRowsPerPage

    const router = useRouter()
    const pathname = usePathname()
    const urlSearchParams = useSearchParams()
    const profileId = useAuth().user?.selectedProfile
    const intl = useIntl()
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
    const isSmallScreen = useisSmallScreen()
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)

    const filteredByTypeLeads = React.useMemo(() => Array.isArray(leads) ? leads : [], [leads])

    const sortedLeads = React.useMemo(() => {
        const leadsToSort = [...filteredByTypeLeads]
        switch (searchParams.sort) {
            case "name-desc":
                return leadsToSort.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
            case "date-asc":
                return leadsToSort
            case "date-desc":
                return leadsToSort.reverse()
            case "name-asc":
            default:
                return leadsToSort.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        }
    }, [filteredByTypeLeads, searchParams.sort])

    const allColumns = React.useMemo(() => leadColumns(locale), [locale])
    const columns = allColumns;

    const table = useReactTable({
        data: sortedLeads,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            columnVisibility: {
                ...columnVisibility,
                company: !isSmallScreen,
                position: !isSmallScreen,
            },
            rowSelection,
            pagination: {
                pageIndex: Number(page) - 1,
                pageSize: currentRowsPerPage,
            },
        },
    })

    // Memoize all filter values to prevent infinite fetch loops
    const memoizedStatus = React.useMemo(() => status, [JSON.stringify(status)])
    const memoizedTypes = React.useMemo(() => types, [JSON.stringify(types)])
    const memoizedPriority = React.useMemo(() => priority, [JSON.stringify(priority)])
    const memoizedTags = React.useMemo(() => tags, [JSON.stringify(tags)])
    const memoizedContacts = React.useMemo(() => contacts, [JSON.stringify(contacts)])
    const memoizedLifeTime = React.useMemo(() => lifeTime, [JSON.stringify(lifeTime)])

    const skip = Number(urlSearchParams.get('skip')) || 0;

    useEffect(() => {
        async function fetchLeads() {
            setLoading(true)
            try {
                const user = await getUserFromCookie()
                const profileId = user?.selectedProfile || null
                const limit = currentRowsPerPage

                // Format lifeTime dates if present
                let formattedLifeTime = memoizedLifeTime
                if (memoizedLifeTime && typeof memoizedLifeTime === "string") {
                    try {
                        const parsed = JSON.parse(memoizedLifeTime)
                        if (parsed && typeof parsed === "object") {
                            if (parsed.begins && parsed.begins.start) {
                                const d = new Date(parsed.begins.start)
                                if (!isNaN(d.getTime())) parsed.begins.start = d.toISOString()
                            }
                            if (parsed.ends && parsed.ends.end) {
                                const d = new Date(parsed.ends.end)
                                if (!isNaN(d.getTime())) parsed.ends.end = d.toISOString()
                            }
                            formattedLifeTime = parsed
                        }
                    } catch (e) {
                        // ignore parse error, use as is
                    }
                }

                const filters = {
                    search,
                    types: memoizedTypes,
                    status: memoizedStatus,
                    priority: memoizedPriority,
                    lifeTime: formattedLifeTime,
                    tags: memoizedTags,
                    contacts: memoizedContacts,
                    limit,
                    skip,
                }
                console.log("Payload being sent:", filters)
                const result = await filterLeads(profileId, filters)
                setLeads(result)
            } catch (error) {
                setLeads([])
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [search, memoizedTypes, memoizedStatus, memoizedPriority, memoizedLifeTime, memoizedTags, memoizedContacts, skip, currentRowsPerPage])

    const handleBulkDelete = async () => {
        if (!profileId) return

        try {
            setIsDeleting(true)
            const selectedRows = Object.keys(rowSelection)
                .filter((index) => rowSelection[index as any])
                .map((index) => sortedLeads[Number.parseInt(index)]._id)

            // TODO: Use removeLeads for bulk delete
            // const response = await removeLeads(profileId, selectedRows)

            // if (response.success) {
            //     toast.success(intl.formatMessage({ id: "Leads deleted successfully" }))
            //     router.refresh()
            // } else {
            //     throw new Error(response.message)
            // }
        } catch (error) {
            console.error("Error deleting leads:", error)
            toast.error(intl.formatMessage({ id: "Failed to delete leads. Please try again." }))
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
            setRowSelection({})
        }
    }

    const selectedRowCount = Object.values(rowSelection).filter(Boolean).length

    console.log("Leads to render:", leads);

    return (
        <div>
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
                    <LeadFilters />
                    <Button asChild className="flex items-center h-10 gap-1 bg-azure">
                        <Link href="./leads/add-lead">
                            <Plus size={16} />
                            <FormattedMessage id="add-lead" defaultMessage="Add lead" />
                        </Link>
                    </Button>
                </div>
            </div>
            {/* Table and PhoneMockup aligned at the top */}
            <div className="sm:flex sm:gap-4 sm:items-start mt-2">
                <div className="flex-1">
                    <div className="rounded-md border bordr-gray-300 overflow-x-auto">
                        <Table className="table-auto relative">
                            <TableHeader className="bg-gray-100 dark:bg-navy">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className={`px-2 py-1 font-normal ${header.column.id === "select" ? "w-fit" : ""} `}>
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
                                            key={row.original._id || row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            onClick={() => {
                                                if (selectedLead?._id === row.original._id) {
                                                    setSelectedLead(null); // Unselect if already selected
                                                } else {
                                                    setSelectedLead(row.original);
                                                }
                                            }}
                                            className="cursor-pointer"
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
                                                                : "truncate px-2"
                                                    )}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                            <TableCell className="px-2 w-12">
                                                <ActionCell lead={row.original} locale={locale} profileId={profileId} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                            <FormattedMessage id="no-leads-found" defaultMessage="No leads found" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={100} className="h-12 p-2 bg-gray-100 dark:bg-navy">
                                        <LeadsPaginationControls
                                            skip={Number(urlSearchParams.get('skip')) || 0}
                                            limit={currentRowsPerPage}
                                            rowCount={leads.length}
                                            totalCount={Number(urlSearchParams.get('totalCount')) || (Number(urlSearchParams.get('skip')) || 0) + leads.length}
                                            onSkipChange={(newSkip) => {
                                                const params = new URLSearchParams(urlSearchParams.toString())
                                                params.set('skip', String(newSkip))
                                                params.set('rowsPerPage', String(currentRowsPerPage))
                                                // Remove page param if present
                                                params.delete('page')
                                                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                                            }}
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
                            itemName={"leads"}
                            isDeleting={isDeleting}
                            message="delete-leads-message"
                        />
                    )}
                </div>
                {/* PhoneMockup on desktop */}
                {/* {selectedLead && !isSmallScreen && (
                    <div className="hidden xl:block h-fit">
                        <PhoneMockup data={{ ...selectedLead, fullName: selectedLead.name, name: undefined }} onClose={() => setSelectedLead(null)} />
                    </div>
                )} */}
            </div>
            {/* PhoneMockup in modal on mobile */}
            {/* {selectedLead && isSmallScreen && (
                <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)} >
                    <DialogContent className="p-0 bg-transparent shadow-none border-none outline-none  max-w-xs [&>button]:hidden">
                        <DialogTitle className="sr-only">Lead Details</DialogTitle>
                        <PhoneMockup data={{ ...selectedLead, fullName: selectedLead.name, name: undefined }} onClose={() => setSelectedLead(null)} />
                    </DialogContent>
                </Dialog>
            )} */}
        </div>
    )
}