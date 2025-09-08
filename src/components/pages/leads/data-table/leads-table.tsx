"use client"
import { MoreHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PriorityText } from "../priority-text"
import type { Lead } from "@/types/leads"
import { StatusBadge, StatusBadgeProps } from "../status-badge"
import { FormattedMessage } from "react-intl"
import { useSearchParams } from "next/navigation"
import { SetStateAction, useMemo, useState } from "react"
import { leadColumns } from "./lead-columns"
import {
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useIsSmallScreen } from "@/hooks/screens"
import { useDynamicRowsPerPage } from "@/hooks/useDynamicRowsPerPage"
import { getLeadMainContact } from "@/utils/lead-utils"
import ActionCell from "./action-cell"
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
}

export function LeadsTable({ leads, searchParams, setSelectedLeads, selectedLeads, setRefreshKey, profileId }: LeadsTableProps) {
  const urlSearchParams = useSearchParams()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const isSmallScreen = useIsSmallScreen()
  const dynamicRowsPerPage = useDynamicRowsPerPage(5, 20)

  const { search = "", types, lifeTime, tags, page = "1", rowsPerPage } = searchParams
  const currentRowsPerPage = Number(rowsPerPage) || dynamicRowsPerPage

  const locale = urlSearchParams.get("locale") || "en"
  const allColumns = useMemo(() => leadColumns(locale), [locale])
  const columns = allColumns
  const table = useReactTable({
    data: leads,
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
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads([...(selectedLeads ?? []), ...leads])
    } else {
      setSelectedLeads([])
    }
  }

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (!selectedLeads || selectedLeads.length === 0) return
    if (checked) {
      setSelectedLeads([...selectedLeads, leads.find((lead) => lead._id === leadId)!])
    } else {
      setSelectedLeads(selectedLeads.filter((lead) => lead._id !== leadId))
    }
  }
  if (leads.length === 0) {
    return <FormattedMessage id="no-leads-found" defaultMessage="No leads found" />
  }
  const isAllSelected = leads.length > 0 && selectedLeads?.length === leads.length
  const isIndeterminate = (selectedLeads?.length ?? 0) > 0 && (selectedLeads?.length ?? 0) < leads.length

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="w-12 px-4 py-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all leads"
                className="data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600"
                {...(isIndeterminate && { "data-state": "indeterminate" })}
              />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center gap-1">
                Name
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center gap-1">
                Status
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center gap-1">
                Priority
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center gap-1">
                Main contact
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center gap-1">
                Members
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center gap-1">
                Tags
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads
            .slice(
              Number(urlSearchParams.get("skip")) || 0,
              (Number(urlSearchParams.get("skip")) || 0) + currentRowsPerPage,
            )
            .map((lead) => {
              const mainContact = getLeadMainContact(lead)
              // const members = getLeadMembers(lead)
              // const tags = getLeadTags(lead)
              const isSelected = selectedLeads?.some((leadObj) => leadObj._id === lead._id)

              return (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectLead(lead._id, checked as boolean)}
                      aria-label={`Select ${lead.name}`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      {lead.description && <div className="text-sm text-gray-500">{lead.description}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-4">
                    <PriorityText priority={lead.priority} />
                  </td>
                  <td className="px-4 py-4">
                    {mainContact && (
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                            {mainContact.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{mainContact.name}</div>
                          <div className="text-sm text-gray-500">{mainContact.organization}</div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {/*<div className="flex items-center gap-1">
                    {members.slice(0, 3).map((member, index) => (
                      <Avatar key={member.id} className="w-6 h-6 -ml-1 first:ml-0 border-2 border-white">
                        <AvatarFallback className="bg-gray-100 text-gray-700 text-xs font-medium">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {members.length > 3 && <span className="text-sm text-gray-500 ml-1">+{members.length - 3}</span>}
                    {members.length === 0 && <span className="text-gray-400">-</span>}
                  </div>*/}
                    members
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {/*{tags.slice(0, 2).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                    {tags.length > 2 && <span className="text-sm text-gray-500">+{tags.length - 2}</span>}
                    {tags.length === 0 && <span className="text-gray-400">-</span>}*/}
                      tags
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ActionCell lead={lead}   profileId={profileId} setRefreshKey={setRefreshKey} />
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
