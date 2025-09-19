"use client"

import { type ChangeEvent, useEffect, useMemo, useState, useRef, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Download, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { LeadsTable } from "./leads-table"
import { leadColumns } from "./lead-columns"
import type { FilterState, Lead, LeadFilters } from "@/types/leads"
import { LeadsHeader } from "./leads-header"
import { LeadsModals } from "./leads-modals"
import { StatusFilter } from "./status-filter"
import { PriorityFilter } from "./priority-filter"
import { useUser } from "@/store/auth-store"
import { useLeads } from "@/hooks/useMockData"
import { useDynamicRowsPerPage } from "@/hooks/useDynamicRowsPerPage"
import FilterIcon from "@/components/filter-icon"

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

export function LeadsDataTable({ locale, searchParams }: LeadsDataTableProps) {
  const user = useUser()
  const { data: leadsData, isLoading } = useLeads()

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])
  const [showAddLead, setShowAddLead] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.search || "")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const [skip, setSkip] = useState(0)
  const dynamicRowsPerPage = useDynamicRowsPerPage(10, 50)

  const [limit, setLimit] = useState(dynamicRowsPerPage)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)

  const { search = "", types, lifeTime, tags, page = "1", rowsPerPage, contacts } = searchParams

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

  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const profileId = "mock-profile-id"
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [showExportDialog, setShowExportDialog] = useState(false)
  const { replace } = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    statuses: status,
    priorities: priority,
    dateRange: { startDate: "", endDate: "" },
    tags: tags || [],
    searchQuery: search,
  })

  const prevFiltersRef = useRef<FilterState>({
    statuses: status,
    priorities: priority,
    dateRange: { startDate: "", endDate: "" },
    tags: tags || [],
    searchQuery: search,
  })

  const updateUrlWithFilters = useCallback(
    (currentFilters: FilterState) => {
      const filtersChanged =
        JSON.stringify(prevFiltersRef.current.statuses) !== JSON.stringify(currentFilters.statuses) ||
        JSON.stringify(prevFiltersRef.current.priorities) !== JSON.stringify(currentFilters.priorities)

      if (!filtersChanged) return

      const params = new URLSearchParams(urlSearchParams.toString())

      if (currentFilters.statuses.length > 0) {
        params.delete("status")
        currentFilters.statuses.forEach((status) => {
          if (status) params.append("status", status)
        })
      } else {
        params.delete("status")
      }

      if (currentFilters.priorities.length > 0) {
        params.delete("priority")
        currentFilters.priorities.forEach((priority) => {
          if (priority) params.append("priority", priority)
        })
      } else {
        params.delete("priority")
      }

      params.set("page", "1")

      prevFiltersRef.current = currentFilters
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, replace, urlSearchParams],
  )

  useEffect(() => {
    if (dynamicRowsPerPage !== limit) {
      setLimit(dynamicRowsPerPage)
    }
  }, [dynamicRowsPerPage, limit])

  useEffect(() => {
    const newSkip = (Number(page) - 1) * limit
    setSkip(newSkip)
  }, [page, limit])

  useEffect(() => {
    updateUrlWithFilters(filters)
  }, [filters, updateUrlWithFilters])

  const allColumns = useMemo(() => leadColumns(locale), [locale])

  const table = useReactTable({
    data: leads,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: Number(page) - 1,
        pageSize: limit,
      },
    },
  })

  const memoizedStatus = useMemo(() => filters.statuses, [JSON.stringify(filters.statuses)])
  const memoizedTypes = useMemo(() => types, [JSON.stringify(types)])
  const memoizedPriority = useMemo(() => filters.priorities, [JSON.stringify(filters.priorities)])
  const memoizedTags = useMemo(() => tags, [JSON.stringify(tags)])
  const memoizedContacts = useMemo(() => contacts, [JSON.stringify(contacts)])
  const memoizedLifeTime = useMemo(() => lifeTime, [JSON.stringify(lifeTime)])

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true)
      try {
        const profileId = user?.selectedProfile || null

        // Use mock data instead of API call
        let filteredLeads = leadsData || []

        // Apply basic filtering on mock data
        if (searchValue) {
          filteredLeads = filteredLeads.filter(lead =>
            lead.company?.toLowerCase().includes(searchValue.toLowerCase()) ||
            lead.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchValue.toLowerCase())
          )
        }

        setLeads(filteredLeads)
        setTotalCount(filteredLeads.length)
        setHasNextPage(false) // No pagination for mock data
      } catch (error) {
        setLeads([])
        setHasNextPage(false)
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [searchValue, leadsData, user?.selectedProfile])

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
        .map((index) => leads[Number.parseInt(index)]._id)

      // Mock removal - just update local state
      const updatedLeads = leads.filter(lead => !selectedRows.includes(lead._id))
      setLeads(updatedLeads)
      setTotalCount(updatedLeads.length)
      toast.success("Leads deleted successfully")
      setRefreshKey((k) => k + 1)
    } catch (error) {
      console.error("Error deleting leads:", error)
      toast.error("Failed to delete leads. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setRowSelection({})
    }
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)

    const timeoutId = setTimeout(() => {
      if (value !== searchParams.search) {
        const params = new URLSearchParams(urlSearchParams.toString())
        if (value) {
          params.set("search", value)
        } else {
          params.delete("search")
        }
        params.set("page", "1")
        params.delete("skip")
        replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length

  const removeStatusFilter = (status?: string) => {
    if (!status) return
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.filter((s) => s !== status),
    }))
  }

  const removePriorityFilter = (priority?: string) => {
    if (!priority) return
    setFilters((prev) => ({
      ...prev,
      priorities: prev.priorities.filter((p) => p !== priority),
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
    const statusesnormalized = statuses.map(s => s.toLowerCase().replace(/\s+/g, '-'))
    console.log("Selected statuses:", statusesnormalized)
    setFilters((prev) => ({
      ...prev,
      statuses: statusesnormalized.filter(
        (
          s,
        ): s is
          | "pending"
          | "prospecting"
          | "offer-sent"
          | "negotiation"
          | "administrative-validation"
          | "done"
          | "failed"
          | "canceled" =>
          [
            "pending",
            "prospecting",
            "offer-sent",
            "negotiation",
            "administrative-validation",
            "done",
            "failed",
            "canceled",
          ].includes(s),
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

  const handleSkipChange = (newSkip: number) => {
    setSkip(newSkip)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <LeadsHeader leadsCount={totalCount} searchValue={searchValue} onSearchChange={handleSearchChange} loading={loading} />

      <div className="px-6">
        <div className="flex flex-col-reverse xs:flex-row items-center justify-between gap-2 mb-4">
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
                Delete ({selectedRowCount})
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">




              <StatusFilter handleStatusChange={handleStatusChange} />
              <PriorityFilter handlePriorityChange={handlePriorityChange} />

              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 bg-white border-none hover:bg-blue-100 hover:text-blue-600 shadow-none"
                onClick={() => setShowAdvancedFilters(true)}
              >
                Advanced filters
                <FilterIcon />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 bg-white border-[1px]"
                onClick={() => setShowExportDialog(true)}
              >
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

        <div className="bg-white rounded-lg border border-gray-200">

          <LeadsTable
            leads={leads}
            searchParams={searchParams}
            setSelectedLeads={setSelectedLeads}
            setShowAddLead={setShowAddLead}
            selectedLeads={selectedLeads}
            showAddLead={showAddLead}
            profileId={profileId}
            setRefreshKey={setRefreshKey}
            onSkipChange={handleSkipChange}
            onLimitChange={handleLimitChange}
            skip={skip}
            limit={limit}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            loading={loading}
          />

        </div>
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
        shouldShowAsModal={true}
      />
    </div>
  )
}
