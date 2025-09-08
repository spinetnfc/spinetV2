"use client"

import { type ChangeEvent, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Download,  Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import { removeLeads } from "@/actions/leads"
import { useDynamicRowsPerPage } from "@/hooks/useDynamicRowsPerPage"
import { filterLeads } from "@/actions/leads"
import { getUserFromCookie } from "@/utils/cookie"
import { EditLeadPanel } from "./edit-lead"
import AddLeadForm from "../add-lead-form"
import { useIsLGScreen, useIsSmallScreen, useIsXLScreen } from "@/hooks/screens"
import { useSidebar } from "@/context/sidebarContext"
import { Badge } from "@/components/ui/badge"
import { LeadsTable } from "./leads-table"
import { PriorityFilter } from "./priority-filter"
import { StatusFilter } from "./status-filter"
 
import { leadColumns } from "./lead-columns" // Import leadColumns

import type { FilterState, Lead } from "@/types/leads"
import { LeadsHeader } from "./leads-header"
import { LeadsModals } from "./leads-modals"

interface LeadsDataTableProps {
  locale: string
  searchParams: {
    types?: string[]
    status?: Array<
      | "pending"
      | "prospecting"
      | "offer-sent"
      | "negotiation"
      | "administrative-validation"
      | "done"
      | "failed"
      | "canceled"
    >
    priority?: Array<"none" | "low" | "medium" | "high" | "critical">
    lifeTime?: {
      begins: {
        start: string
        end: string
      }
      ends: {
        start: string
        end: string
      }
    }
    tags?: string[]
    contacts?: string[]
    search?: string
    sort?: string
    page?: string
    rowsPerPage?: string
  }
}

const FilterIcon = () => (
  <span className="inline-flex items-center justify-center text-blue-800">
    <svg
      width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M10 16.583H14C14.1105 16.583 14.2168 16.6269 14.2949 16.7051C14.3731 16.7832 14.417 16.8895 14.417 17C14.417 17.1105 14.3731 17.2168 14.2949 17.2949C14.2168 17.3731 14.1105 17.417 14 17.417H10C9.88949 17.417 9.78322 17.3731 9.70508 17.2949C9.62694 17.2168 9.58301 17.1105 9.58301 17C9.58301 16.8895 9.62694 16.7832 9.70508 16.7051C9.78322 16.6269 9.88949 16.583 10 16.583ZM7 11.583H17C17.1105 11.583 17.2168 11.6269 17.2949 11.7051C17.3731 11.7832 17.417 11.8895 17.417 12C17.417 12.1105 17.3731 12.2168 17.2949 12.2949C17.2168 12.3731 17.1105 12.417 17 12.417H7C6.88949 12.417 6.78322 12.3731 6.70508 12.2949C6.62694 12.2168 6.58301 12.1105 6.58301 12C6.58301 11.8895 6.62694 11.7832 6.70508 11.7051C6.78322 11.6269 6.88949 11.583 7 11.583ZM4.5 6.58301H19.5C19.6105 6.58301 19.7168 6.62694 19.7949 6.70508C19.8731 6.78322 19.917 6.88949 19.917 7C19.917 7.11051 19.8731 7.21678 19.7949 7.29492C19.7168 7.37306 19.6105 7.41699 19.5 7.41699H4.5C4.38949 7.41699 4.28322 7.37306 4.20508 7.29492C4.12694 7.21678 4.08301 7.11051 4.08301 7C4.08301 6.88949 4.12694 6.78322 4.20508 6.70508C4.28322 6.62694 4.38949 6.58301 4.5 6.58301Z"
fill="#2563EB"
stroke="#2563EB"
strokeWidth="0.666667"
/>
</svg>
</span>
)


export function LeadsDataTable({ locale, searchParams }: LeadsDataTableProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])
  const [showAddLead, setShowAddLead] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.search || "")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const dynamicRowsPerPage = useDynamicRowsPerPage(5, 20)

  const { search = "", types, lifeTime, tags, page = "1", rowsPerPage } = searchParams

  const status = Array.isArray(searchParams.status)
    ? searchParams.status
    : searchParams.status
      ? [searchParams.status]
      : []
  const priority = Array.isArray(searchParams.priority)
    ? searchParams.priority
    : searchParams.priority
      ? [searchParams.priority]
      : []
  const contacts = Array.isArray(searchParams.contacts)
    ? searchParams.contacts
    : searchParams.contacts
      ? [searchParams.contacts]
      : []
  const currentRowsPerPage = Number(rowsPerPage) || dynamicRowsPerPage

  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const profileId = useAuth().user?.selectedProfile
  const intl = useIntl()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [showExportDialog, setShowExportDialog] = useState(false)
  const isSmallScreen = useIsSmallScreen()
  const isLGScreen = useIsLGScreen()
  const isXLScreen = useIsXLScreen()
  const { isExpanded } = useSidebar()
  const { replace } = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    statuses: [],
    priorities: [],
    dateRange: { startDate: "", endDate: "" },
    tags: [],
    searchQuery: "",
  })
  const filteredByTypeLeads = useMemo(() => (Array.isArray(leads) ? leads : []), [leads])

  const sortedLeads = useMemo(() => {
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

  const allColumns = useMemo(() => leadColumns(locale), [locale])
  const columns = allColumns

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

  const memoizedStatus = useMemo(() => status, [JSON.stringify(status)])
  const memoizedTypes = useMemo(() => types, [JSON.stringify(types)])
  const memoizedPriority = useMemo(() => priority, [JSON.stringify(priority)])
  const memoizedTags = useMemo(() => tags, [JSON.stringify(tags)])
  const memoizedContacts = useMemo(() => contacts, [JSON.stringify(contacts)])
  const memoizedLifeTime = useMemo(() => lifeTime, [JSON.stringify(lifeTime)])

  const skip = Number(urlSearchParams.get("skip")) || 0

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true)
      try {
        const user = await getUserFromCookie()
        const profileId = user?.selectedProfile || null
        const limit = currentRowsPerPage

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
          tags: memoizedTags,
          contacts: memoizedContacts,
          limit,
          skip,
        }
        // console.log("Payload being sent:", filters)
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
  }, [
    search,
    memoizedTypes,
    memoizedStatus,
    memoizedPriority,
    memoizedLifeTime,
    memoizedTags,
    memoizedContacts,
    skip,
    currentRowsPerPage,
    refreshKey,
  ])

  const handleLeadSave = (updatedLead: Lead) => {
    console.log("Saving lead:", updatedLead)
    setSelectedLeads([])
    setRefreshKey((k) => k + 1)
  }

  const handleAddLeadSave = () => {
    setShowAddLead(false)
    setRefreshKey((k) => k + 1)
  }

  const handleBulkDelete = async () => {
    if (!profileId) return

    try {
      setIsDeleting(true)
      const selectedRows = Object.keys(rowSelection)
        .filter((index) => rowSelection[index as any])
        .map((index) => sortedLeads[Number.parseInt(index)]._id)

      const response = await removeLeads(profileId, selectedRows)
      if (response.success) {
        toast.success(intl.formatMessage({ id: "Leads deleted successfully" }))
        setRefreshKey((k) => k + 1)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error deleting leads:", error)
      toast.error(intl.formatMessage({ id: "Failed to delete leads. Please try again." }))
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setRowSelection({})
    }
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    const params = new URLSearchParams(searchParams.toString())
    if (event.target.value) {
      params.set("search", event.target.value)
    } else {
      params.delete("search")
    }
    params.set("page", "1")
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length

  const removeStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.filter((s) => s !== status),
    }))
  }

  const handlePriorityChange = (priorities: string[]) => {
    setFilters((prev) => ({
      ...prev,
      priorities: priorities.filter((p): p is "none" | "low" | "medium" | "high" | "critical" =>
        ["none", "low", "medium", "high", "critical"].includes(p),
      ),
    }))
  }

  const handleStatusChange = (statuses: string[]) => {
    setFilters((prev) => ({
      ...prev,
      status: statuses.filter((s): s is "none" | "low" | "medium" | "high" | "critical" =>
        ["none", "low", "medium", "high", "critical"].includes(s),
      ),
    }))
  }

  const removeTagFilter = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const activeFilterCount =
    filters.statuses.length +
    filters.priorities.length +
    filters.tags.length +
    (filters.dateRange.startDate || filters.dateRange.endDate ? 1 : 0)

  return (
    <div>
      <LeadsHeader
        leadsCount={leads.length}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onAddLead={() => {
          setShowAddLead(true)
          setSelectedLeads([])
        }}
      />

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
      </div>

      {/* Filters */}
      <div className="bg-white  px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {filters.statuses.map((status) => (
              <Badge key={status} variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                {status}
                <button
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  onClick={() => status && removeStatusFilter(status)}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}

            <StatusFilter handleStatusChange={handleStatusChange} />
            <PriorityFilter handlePriorityChange={handlePriorityChange} />

            {filters.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                {tag}
                <button className="ml-1 hover:bg-gray-200 rounded-full p-0.5" onClick={() => removeTagFilter(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}

            {(filters.dateRange.startDate || filters.dateRange.endDate) && (
              <Badge variant="outline" className="gap-1">
                Date Range
                <button
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  onClick={() => setFilters((prev) => ({ ...prev, dateRange: { startDate: "", endDate: "" } }))}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-blue-600 bg-white border-0 hover:bg-blue-100 hover:text-blue-600"
              onClick={() => setShowAdvancedFilters(true)}
            >
              Advanced filters
              <FilterIcon   />
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2 bg-white border-[1px]">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 bg-white border-[1px]">
              <Settings className="w-4 h-4" />
              Modify columns
            </Button>
          </div>
        </div>
      </div>

      <div className={`sm:flex  ${selectedLeads.length > 0 || showAddLead ? "gap-4" : ""} sm:items-start mt-2`}>
        <div className="flex-1">
          <div className="rounded-md border bordr-gray-300 overflow-x-auto">
            {leads.length > 0 && !loading && (
              <LeadsTable
                leads={leads}
                searchParams={searchParams}
                setSelectedLeads={setSelectedLeads}
                setShowAddLead={setShowAddLead}
                selectedLeads={selectedLeads}
                showAddLead={showAddLead}
                profileId={profileId}
                setRefreshKey={setRefreshKey}
              />
            )}
          </div>
        </div>

        {(isXLScreen || (!isExpanded && isLGScreen)) && (
          <div className="hidden lg:block h-fit">
            {showAddLead ? (
              <AddLeadForm locale={locale} onSave={handleAddLeadSave} onClose={() => setShowAddLead(false)} />
            ) : selectedLeads.length === 1 ? (
              <EditLeadPanel lead={selectedLeads[0]} onClose={() => setSelectedLeads([])} onSave={handleLeadSave} />
            ) : null}
          </div>
        )}
      </div>

      <LeadsModals
        showAddLead={showAddLead}
        onAddLeadClose={() => setShowAddLead(false)}
        onAddLeadSave={handleAddLeadSave}
        locale={locale}
        selectedLeads={selectedLeads}
        onEditLeadClose={() => setSelectedLeads([])}
        onEditLeadSave={handleLeadSave}
        showDeleteModal={showDeleteModal}
        onDeleteModalClose={() => setShowDeleteModal(false)}
        onDeleteConfirm={handleBulkDelete}
        isDeleting={isDeleting}
        showExportDialog={showExportDialog}
        onExportDialogClose={() => setShowExportDialog(false)}
        showAdvancedFilters={showAdvancedFilters}
        onAdvancedFiltersClose={() => setShowAdvancedFilters(false)}
        onFiltersChange={setFilters}
        currentFilters={filters}
        shouldShowAsModal={!(isXLScreen || (!isExpanded && isLGScreen))}
      />
    </div>
  )
}
