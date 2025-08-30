"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  type ColumnFiltersState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useSidebar } from "@/context/sidebarContext"
import { useIsLGScreen, useIsSmallScreen, useIsXLScreen } from "@/hooks/screens"
import { useDynamicRowsPerPage } from "@/hooks/useDynamicRowsPerPage"
import { getContacts } from "@/lib/api/contacts"
import { contactColumns } from "./contact-columns"
import { ContactsBulkActions } from "./contacts-bulk-actions"
import { FilterDialogue } from "./filter-dialogue"
import PhoneMockup from "../phone-mockup"
import EditContactForm from "../edit-contact-form"
import type { Contact } from "@/types/contact"
import { ContactsModals } from "./contacts-modals"
import { ContactsHeader } from "./contacts-header"
import { ContactsTable } from "./contacts-table"

interface ContactsDataTableProps {
  profileId: string | undefined
  locale: string
  searchParams: {
    query?: string
    filter?: string
    sort?: string
    page?: string
    rowsPerPage?: string
  }
}



export function ContactsDataTable({ profileId, locale, searchParams }: ContactsDataTableProps) {
  const dynamicRowsPerPage = useDynamicRowsPerPage(5, 20)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [contactSources, setContactSources] = useState<string[]>([])
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)

  const [advancedFilters, setAdvancedFilters] = useState({
    role: "",
    company: "",
    orderBy: ["activity-count"] as string[],
    sortBy: "newest",
  })

  const {
    query = "",
    filter = "all",
    sort = "name-asc",
    page = "1",
    rowsPerPage = contacts.length < dynamicRowsPerPage ? contacts.length : dynamicRowsPerPage.toString(),
  } = searchParams

  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const { isExpanded } = useSidebar()
  const isSmallScreen = useIsSmallScreen()
  const isLGScreen = useIsLGScreen()
  const isXLScreen = useIsXLScreen()

  const initialFiltering: ColumnFiltersState = []
  if (query) {
    initialFiltering.push({ id: "name", value: query })
  }
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialFiltering)

  const filteredByTypeContacts = useMemo(() => {
    let filtered =
      filter === "all"
        ? contacts
        : contacts.filter((contact) => {
            if ("id" in contact.Profile) return false
            return contact.type === filter
          })

    // Apply advanced filters
    if (advancedFilters.role) {
      filtered = filtered.filter((contact) => {
        const position = typeof contact.Profile.position === "string" ? contact.Profile.position.toLowerCase() : ""
        return position.includes(advancedFilters.role.toLowerCase())
      })
    }

    if (advancedFilters.company) {
      filtered = filtered.filter((contact) => {
        const companyName =
          typeof contact.Profile.companyName === "string" ? contact.Profile.companyName.toLowerCase() : ""
        return companyName.includes(advancedFilters.company.toLowerCase())
      })
    }

    return filtered
  }, [contacts, filter, advancedFilters])

  const sortedContacts = useMemo(() => {
    const contactsToSort = [...filteredByTypeContacts]

    // Use advanced sort if available, otherwise use URL sort
    const sortMethod =
      advancedFilters.sortBy === "newest" ? "date-desc" : advancedFilters.sortBy === "oldest" ? "date-asc" : sort

    switch (sortMethod) {
      case "name-desc":
        return contactsToSort.sort((a, b) => (b.Profile.fullName || "").localeCompare(a.Profile.fullName || ""))
      case "date-asc":
        return contactsToSort
      case "date-desc":
        return contactsToSort.reverse()
      case "name-asc":
      default:
        return contactsToSort.sort((a, b) => (a.Profile.fullName || "").localeCompare(b.Profile.fullName || ""))
    }
  }, [filteredByTypeContacts, sort, advancedFilters.sortBy])

  const selectedContacts = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((index) => rowSelection[index])
      .map((index) => sortedContacts[Number.parseInt(index)])
  }, [rowSelection, sortedContacts])

  const columns = useMemo(() => contactColumns(locale), [locale])

  const orderedColumns = useMemo(() => {
    if (columnOrder.length === 0) {
      return columns
    }

    // Reorder columns based on columnOrder state
    const reorderedColumns = []
    const columnMap = new Map(columns.map((col) => [col.id || "", col]))

    // Add columns in the specified order
    for (const colId of columnOrder) {
      const column = columnMap.get(colId)
      if (column) {
        reorderedColumns.push(column)
        columnMap.delete(colId)
      }
    }

    // Add any remaining columns that weren't in the order
    reorderedColumns.push(...Array.from(columnMap.values()))

    return reorderedColumns
  }, [columns, columnOrder])

  const showInModal = !(isXLScreen || (!isExpanded && isLGScreen))

  const table = useReactTable({
    data: sortedContacts,
    columns: orderedColumns,
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
      pagination: {
        pageIndex: Number(page) - 1,
        pageSize: Number(rowsPerPage),
      },
    },
  })

  const handleContactSourceChange = useCallback((sources: string[]) => {
    setContactSources(sources)
    // Update column filters for source filtering
    setColumnFilters((prev) => [
      ...prev.filter((f) => f.id !== "source"), // remove old source filter
      ...(sources.length > 0 ? [{ id: "source", value: sources }] : []),
    ])
  }, [])

  useEffect(() => {
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

    // Only update URL if search query or pagination changed, not source filters
    if (newParamsString !== currentParamsString) {
      router.replace(`${pathname}?${newParamsString}`, { scroll: false })
    }
  }, [
    columnFilters.filter((f) => f.id === "name"), // Only watch name filter changes
    table.getState().pagination.pageIndex,
    urlSearchParams,
    pathname,
    router,
  ])

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true)
        if (profileId != null && profileId != undefined) {
          const fetchedContacts = await getContacts(profileId)
          setContacts(fetchedContacts)
        }
      } catch (error) {
        console.error("Error fetching contacts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [profileId])

  const handleContactSelect = (contact: Contact | null) => {
    setSelectedContact(contact)
    setEditingContact(null)
  }

  const handleContactEdit = (contact: Contact) => {
    setEditingContact(contact)
    setSelectedContact(null)
  }

  const handleEditSuccess = () => {
    setEditingContact(null)
    router.refresh()
  }

  const handleAdvancedFiltersChange = useCallback(
    (filters: {
      role?: string
      company?: string
      orderBy: string[]
      sortBy: string
    }) => {
      setAdvancedFilters((prev) => ({
        role: filters.role ?? prev.role,
        company: filters.company ?? prev.company,
        orderBy: filters.orderBy,
        sortBy: filters.sortBy,
      }))
    },
    [],
  )

  const handleColumnOrderChange = useCallback(
    (visibleColumns: string[], newColumnOrder: string[]) => {
 

      setColumnVisibility((prev) => {
        const newVisibility: VisibilityState = {}

        // Get all column IDs from the table
        const allColumnIds = columns.map((col) => col.id || "")

        // Set visibility for all columns
        allColumnIds.forEach((columnId) => {
          // Always keep name and select visible
          if (columnId === "name" || columnId === "select") {
            newVisibility[columnId] = true
          } else {
            // For other columns, use the visibleColumns array
            newVisibility[columnId] = visibleColumns.includes(columnId)
          }
        })
  console.log("Updated column visibility:", newVisibility) // ✅ log here

        return newVisibility
      })
       setColumnOrder(newColumnOrder)
    },
    [columns],
  )
   if (loading) return null

  return (
    <main>
      <FilterDialogue
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        onFiltersChange={handleAdvancedFiltersChange} // Connected filter handler
        currentFilters={advancedFilters} // Pass current filters
      />

      <ContactsHeader
        contactsCount={contacts.length}
        onAdvancedFiltersClick={() => setIsAdvancedFilterOpen(true)}
        setContactSources={handleContactSourceChange}
        setIsColumnModalOpen={setIsColumnModalOpen}
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
            contactsCount={contacts.length}
            rowsPerPage={Number(rowsPerPage)}
            onColumnOrderChange={handleColumnOrderChange}
            isColumnModalOpen={isColumnModalOpen}
            setIsColumnModalOpen={setIsColumnModalOpen}
          />
        </div>

        {/* Desktop sidebar for contact details/editing */}
        <div className="hidden lg:block h-fit space-y-4">
          {selectedContact && !editingContact && !showInModal && (
            <PhoneMockup data={selectedContact.Profile} onClose={() => setSelectedContact(null)} />
          )}
          {editingContact && !selectedContact && !showInModal && (
            <EditContactForm
              contact={editingContact}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingContact(null)}
            />
          )}
        </div>
      </div>

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
