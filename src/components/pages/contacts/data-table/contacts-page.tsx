"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  type ColumnFiltersState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useSidebar } from "@/context/sidebarContext"
import { useIsLGScreen, useIsXLScreen } from "@/hooks/screens"
import { useDynamicRowsPerPage } from "@/hooks/useDynamicRowsPerPage"
import { getContacts } from "@/lib/api/contacts"
import { contactColumns } from "./contact-columns"
import { ContactsBulkActions } from "./contacts-bulk-actions"
import { FilterDialogue } from "./filter-dialogue"
 import type { Contact } from "@/types/contact"
import { ContactsModals } from "./contacts-modals"
import { ContactsHeader } from "./contacts-header"
import { ContactsTable } from "./contacts-table"
import { ExportDialogue } from "./export-dialogue"
import { useAuth } from "@/context/authContext"
import PhoneMockup from "../contact-details"

interface ContactsDataTableProps {
  locale: string
  searchParams: {
    query?: string
    filter?: string
    sort?: string
    page?: string
    rowsPerPage?: string
  }
}

export function ContactsDataTable({ locale, searchParams }: ContactsDataTableProps) {
 const dynamicRowsPerPage = useDynamicRowsPerPage(5, 20)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const { user } = useAuth()
  const profileId = user?.selectedProfile || undefined
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const { isExpanded } = useSidebar()
  const isLGScreen = useIsLGScreen()
  const isXLScreen = useIsXLScreen()

  const [filters, setFilters] = useState({
    query: searchParams.query || "",
    filter: searchParams.filter || "all",
    sort: searchParams.sort || "name-asc",
    role: "",
    company: "",
    sources: [] as string[],
    sortBy: "newest",
  })

  const [pagination, setPagination] = useState({
    pageIndex: Math.max(0, Number(searchParams.page || 1) - 1),
    pageSize: Number(searchParams.rowsPerPage) || dynamicRowsPerPage,
  })

  useEffect(() => {
    const currentPage = urlSearchParams.get("page")
    const currentRowsPerPage = urlSearchParams.get("rowsPerPage")

    const newPageIndex = Math.max(0, Number(currentPage || 1) - 1)
    const newPageSize = Number(currentRowsPerPage) || dynamicRowsPerPage

    setPagination((prev) => {
      if (prev.pageIndex !== newPageIndex || prev.pageSize !== newPageSize) {
        return { pageIndex: newPageIndex, pageSize: newPageSize }
      }
      return prev
    })
  }, [urlSearchParams, dynamicRowsPerPage])

  const updateURL = useCallback(
    (newPagination: typeof pagination) => {
      const params = new URLSearchParams(urlSearchParams.toString())
      params.set("page", String(newPagination.pageIndex + 1))
      params.set("rowsPerPage", String(newPagination.pageSize))
      // Try this instead
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, urlSearchParams],
  )

  const processedContacts = useMemo(() => {
    let filtered = contacts

    // Apply type filter
    if (filters.filter !== "all") {
      filtered = filtered.filter((contact) => {
        if ("id" in contact.Profile) return false
        return contact.type === filters.filter
      })
    }

    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(
        (contact) =>
          contact.Profile.fullName?.toLowerCase().includes(query) ||
          contact.Profile.companyName?.toLowerCase().includes(query) ||
          contact.Profile.position?.toLowerCase().includes(query),
      )
    }

    // Apply advanced filters
    if (filters.role) {
      filtered = filtered.filter((contact) => {
        const position = typeof contact.Profile.position === "string" ? contact.Profile.position.toLowerCase() : ""
        return position.includes(filters.role.toLowerCase())
      })
    }

    if (filters.company) {
      filtered = filtered.filter((contact) => {
        const companyName =
          typeof contact.Profile.companyName === "string" ? contact.Profile.companyName.toLowerCase() : ""
        return companyName.includes(filters.company.toLowerCase())
      })
    }

    // Apply source filters
    if (filters.sources.length > 0) {
      filtered = filtered.filter((contact) => filters.sources.includes(contact.type || ""))
    }

    // Apply sorting
    const sortMethod =
      filters.sortBy === "newest" ? "date-desc" : filters.sortBy === "oldest" ? "date-asc" : filters.sort

    switch (sortMethod) {
      case "name-desc":
        return filtered.sort((a, b) => (b.Profile.fullName || "").localeCompare(a.Profile.fullName || ""))
      case "date-asc":
        return filtered
      case "date-desc":
        return [...filtered].reverse()
      case "name-asc":
      default:
        return filtered.sort((a, b) => (a.Profile.fullName || "").localeCompare(b.Profile.fullName || ""))
    }
  }, [contacts, filters])

  const selectedContacts = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((index) => rowSelection[index])
      .map((index) => processedContacts[Number.parseInt(index)])
  }, [rowSelection, processedContacts])

  const columns = useMemo(() => contactColumns(locale), [locale])

  const orderedColumns = useMemo(() => {
    if (columnOrder.length === 0) return columns

    const reorderedColumns = []
    const columnMap = new Map(columns.map((col) => [col.id || "", col]))

    for (const colId of columnOrder) {
      const column = columnMap.get(colId)
      if (column) {
        reorderedColumns.push(column)
        columnMap.delete(colId)
      }
    }

    reorderedColumns.push(...Array.from(columnMap.values()))
    return reorderedColumns
  }, [columns, columnOrder])

  const columnFilters: ColumnFiltersState = useMemo(() => {
    const filterArray: ColumnFiltersState = []
    if (filters.query) {
      filterArray.push({ id: "name", value: filters.query })
    }
    return filterArray
  }, [filters.query])

  const showInModal = !(isXLScreen || (!isExpanded && isLGScreen))

  const table = useReactTable({
    data: processedContacts,
    columns: orderedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  useEffect(() => {
    async function fetchContacts() {
      if (!profileId) return

      try {
        setLoading(true)
        if (!profileId) return
        const fetchedContacts = await getContacts(profileId)
        setContacts(fetchedContacts)
      } catch (error) {
        console.error("Error fetching contacts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [profileId])

  useEffect(() => {
    updateURL(pagination)
  }, [pagination, updateURL])

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleContactSourceChange = useCallback((sources: string[]) => {
    setFilters((prev) => ({ ...prev, sources }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleAdvancedFiltersChange = useCallback(
    (newFilters: {
      role?: string
      company?: string
      orderBy: string[]
      sortBy: string
    }) => {
      setFilters((prev) => ({
        ...prev,
        role: newFilters.role ?? prev.role,
        company: newFilters.company ?? prev.company,
        sortBy: newFilters.sortBy,
      }))
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    },
    [],
  )

  const handleColumnOrderChange = useCallback(
    (visibleColumns: string[], newColumnOrder: string[]) => {
      setColumnVisibility((prev) => {
        const newVisibility: VisibilityState = {}
        const allColumnIds = columns.map((col) => col.id || "")

        allColumnIds.forEach((columnId) => {
          if (columnId === "name" || columnId === "select") {
            newVisibility[columnId] = true
          } else {
            newVisibility[columnId] = visibleColumns.includes(columnId)
          }
        })

        return newVisibility
      })
      setColumnOrder(newColumnOrder)
    },
    [columns],
  )

  const handleContactSelect = useCallback((contact: Contact | null) => {
    setSelectedContact(contact)
    setEditingContact(null)
  }, [])

  const handleContactEdit = useCallback((contact: Contact) => {
    setEditingContact(contact)
    setSelectedContact(null)
  }, [])

  const handleEditSuccess = useCallback(() => {
    setEditingContact(null)
    router.refresh()
  }, [router])

  if (loading) return null


  return (
    <main>
      <FilterDialogue
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        onFiltersChange={handleAdvancedFiltersChange}
        currentFilters={{
          role: filters.role,
          company: filters.company,
          orderBy: ["activity-count"],
          sortBy: filters.sortBy,
        }}
      />

      <ContactsHeader
        contactsCount={contacts.length}
        onAdvancedFiltersClick={() => setIsAdvancedFilterOpen(true)}
        setContactSources={handleContactSourceChange}
        setIsColumnModalOpen={setIsColumnModalOpen}
        searchQuery={filters.query}
        onSearchChange={handleSearchChange}
        setIsExportModalOpen={setIsExportModalOpen}
      />

      <div className="flex flex-col-reverse xs:flex-row items-center justify-between gap-2">
        <ContactsBulkActions
          selectedContacts={selectedContacts}
          profileId={profileId}
          onSelectionClear={() => setRowSelection({})}
        />
      </div>

      <div className={`sm:flex ${selectedContact || editingContact ? "gap-4" : ""} sm:items-start mt-2`}>
        <div className="flex-1">
          <ContactsTable
            table={table}
            selectedContact={selectedContact}
            onContactSelect={handleContactSelect}
            onContactEdit={handleContactEdit}
            profileId={profileId}
            locale={locale}
            contactsCount={processedContacts.length}
            rowsPerPage={pagination.pageSize}
            onColumnOrderChange={handleColumnOrderChange}
            isColumnModalOpen={isColumnModalOpen}
            setIsColumnModalOpen={setIsColumnModalOpen}
          />
        </div>

        <div className="hidden lg:block h-fit space-y-4">
          {(selectedContact && !showInModal) && (
            <PhoneMockup contact={selectedContact} onClose={() => setSelectedContact(null)} />
          )}
         
        </div>
      </div>

      <ExportDialogue
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        contacts={processedContacts}
      />

      <ContactsModals
        selectedContact={selectedContact}
        editingContact={editingContact}
        showInModal={showInModal}
        onContactClose={() => setSelectedContact(null)}
        onEditClose={() => setEditingContact(null)}
        onEditSuccess={handleEditSuccess}
      />
    </main>
  )
}
