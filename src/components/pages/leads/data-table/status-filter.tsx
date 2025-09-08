"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/utils/cn"

// 1. Define typed source keys
export  type Status =
  | "Pending"
  | "Prospecting"
  | "Offer sent"
  | "Negotiation"
  | "Administrative validation"
  | "Done"
  | "Failed"
  | "Canceled";


// 2. Map source keys to labels for UI
const statusLabels: Record<Status, string> = {
  Pending: "Pending",
  Prospecting: "Prospecting",
  "Offer sent": "Offer sent",
  Negotiation: "Negotiation",
  "Administrative validation": "Administrative validation",
  Done: "Done",
  Failed: "Failed",
  Canceled: "Canceled",
}

export function StatusFilter({
  handleStatusChange,
}: {
  handleStatusChange: (statuses: string[]) => void
}) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const updateStatuses = (newStatuses: string[]) => {
    setSelectedStatuses(newStatuses)
    handleStatusChange(newStatuses)
  }

  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]

    updateStatuses(newStatuses)
  }

  const clearAll = (event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    updateStatuses([])
  }

  const getButtonText = () => {
    if (selectedStatuses.length === 0) return "status"
    if (selectedStatuses.length === 1) return selectedStatuses[0]
    return `(${selectedStatuses.length}) status`
  }

  return (
    <div className="flex items-center gap-2 shadow-none">
      <DropdownMenu modal={false}>
        <div
          className={cn(
            "hover:bg-blue-100 rounded-2xl flex items-center",
            selectedStatuses.length === 0 ? "pr-0" : "pr-2 bg-blue-100",
          )}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "h-9 border-none text-primary hover:bg-blue-100 bg-transparent rounded-2xl shadow-none",
                selectedStatuses.length > 0 ? "pr-2" : "",
              )}
            >
              <span className="flex-1 text-left">{getButtonText()}</span>
              {selectedStatuses.length === 0 && <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </DropdownMenuTrigger>

          {selectedStatuses.length > 0 && (
            <button type="button" onClick={clearAll} className="hover:bg-gray-100 rounded-sm p-0.5 ml-1">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <DropdownMenuContent align="start" className="w-48">
          {Object.entries(statusLabels).map(([key, label]) => {
            const source = key as Status
            return (
              <DropdownMenuCheckboxItem
                key={source}
                checked={selectedStatuses.includes(source)}
                onCheckedChange={(checked) => handleStatusToggle(source)}
                onSelect={(e) => e.preventDefault()}
                className="text-gray-700"
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
