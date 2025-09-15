"use client"
import { MoreHorizontal, ChevronDown } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import type { Lead } from "@/types/leads"
import { useSearchParams } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import { leadColumns } from "./lead-columns"
import {
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"
import { LeadsPaginationControls } from "./leads-pagination-controls"
import { TableSkeleton } from "./lead-table-skeleton"

interface LeadsTableProps {
  leads: Lead[]
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
  setSelectedLeads: (leads: Lead[]) => void
  selectedLeads: Lead[] | null
  showAddLead?: boolean
  setShowAddLead?: (show: boolean) => void
  profileId?: string | undefined
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>
  onSkipChange: (newSkip: number) => void
  onLimitChange: (newLimit: number) => void
  skip: number
  limit: number
  totalCount: number
  hasNextPage?: boolean
  loading: boolean
}

export function LeadsTable({
  leads,
  searchParams,
  setSelectedLeads,
  selectedLeads,
  setRefreshKey,
  profileId,
  onSkipChange,
  onLimitChange,
  skip,
  limit,
  totalCount,
  hasNextPage = false,
  loading
}: LeadsTableProps) {
  const urlSearchParams = useSearchParams()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const { search = "", types, lifeTime, tags, page = "1", rowsPerPage } = searchParams
 
  const locale = urlSearchParams.get("locale") || "en"
  const allColumns = useMemo(() => leadColumns(locale, isMobile), [locale, isMobile])

  const table = useReactTable({
    data: leads,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility: {
        ...columnVisibility,
        mainContact: !isMobile,
        tags: !isMobile,
        createdAt: !isMobile,
      },
      rowSelection,
      pagination: {
        pageIndex: Math.floor(skip / limit),
        pageSize: limit,
      },
    },
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads([...(selectedLeads ?? []), ...leads])
    } else {
      setSelectedLeads([])
    }
  }

  const handleSelectLead = (leadId: string, checked: boolean) => {
    const currentSelected = selectedLeads || []
    if (checked) {
      const leadToAdd = leads.find((lead) => lead._id === leadId)
      if (leadToAdd) {
        setSelectedLeads([...currentSelected, leadToAdd])
      }
    } else {
      setSelectedLeads(currentSelected.filter((lead) => lead._id !== leadId))
    }
  }



  const isAllSelected = leads.length > 0 && selectedLeads?.length === leads.length
  const isIndeterminate = (selectedLeads?.length ?? 0) > 0 && (selectedLeads?.length ?? 0) < leads.length
  if(loading)
    return( <TableSkeleton columns={allColumns} showActions={true} />)

    if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <EmptyLeadsState />
      </div>
    )
  }
  return (
    <div className="bg-white">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-3 text-sm font-medium text-gray-900"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => {
                const isSelected = selectedLeads?.some((leadObj) => leadObj._id === row.original._id)

                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="px-4 py-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <LeadsPaginationControls
        skip={skip}
        limit={limit}
        rowCount={leads.length}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        onSkipChange={onSkipChange}
        onLimitChange={onLimitChange}
      />
    </div>
  )
}

const EmptyLeadsState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div>
        <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4.5" y="4" width="48" height="48" rx="24" fill="#DBEAFE" />
          <rect x="4.5" y="4" width="48" height="48" rx="24" stroke="#EFF6FF" strokeWidth="8" />
          <path
            d="M27.5 35C31.9183 35 35.5 31.4183 35.5 27C35.5 22.5817 31.9183 19 27.5 19C23.0817 19 19.5 22.5817 19.5 27C19.5 31.4183 23.0817 35 27.5 35Z"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M37.5004 36.9999L33.1504 32.6499"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
      <p className="text-center text-gray-500 mt-2">There is nothing to display here yet.</p>
    </div>
  )
}
