"use client"

import React, { useState, useMemo } from "react"
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
import { ContactSourceFilter } from "./contact-source-dialogue"
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
  const [isContactFilterOpen, setIsContactFilterOpen] = useState(false)

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
    if (filter === "all") return contacts
    return contacts.filter((contact) => {
      if ("id" in contact.Profile) return false
      return contact.type === filter
    })
  }, [contacts, filter])

  const sortedContacts = useMemo(() => {
    const contactsToSort = [...filteredByTypeContacts]
    switch (sort) {
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
  }, [filteredByTypeContacts, sort])

  const selectedContacts = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((index) => rowSelection[index])
      .map((index) => sortedContacts[Number.parseInt(index)])
  }, [rowSelection, sortedContacts])

  const columns = useMemo(() => contactColumns(locale), [locale])
  const showInModal = !(isXLScreen || (!isExpanded && isLGScreen))

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
        company: !isSmallScreen,
        position: !isSmallScreen,
      },
      rowSelection,
      pagination: {
        pageIndex: Number(page) - 1,
        pageSize: Number(rowsPerPage),
      },
    },
  })

  React.useEffect(() => {
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
      router.replace(`${pathname}?${newParamsString}`, { scroll: false })
    }
  }, [columnFilters, table.getState().pagination.pageIndex,urlSearchParams, profileId])

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

  if (loading) return null

  return (
    <main>
      <FilterDialogue isOpen={isAdvancedFilterOpen} onClose={() => setIsAdvancedFilterOpen(false)} />
      <ContactSourceFilter isOpen={isContactFilterOpen} onClose={() => setIsContactFilterOpen(false)} />

      <ContactsHeader contactsCount={contacts.length} onAdvancedFiltersClick={() => setIsAdvancedFilterOpen(true)} onContactSourceClick={() => setIsContactFilterOpen(true)} />

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
