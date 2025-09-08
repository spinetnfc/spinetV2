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
export type priority = "none" | "low" | "medium" | "high" | "critical"

// 2. Map source keys to labels for UI
const priorityLabels: Record<priority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

export function PriorityFilter({
  handlePriorityChange,
}: {
  handlePriorityChange: (priorities: string[]) => void
}) {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])

  const updatePriorities = (newPriorities: string[]) => {
    setSelectedPriorities(newPriorities)
    handlePriorityChange(newPriorities)
  }

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority)
      : [...selectedPriorities, priority]

    updatePriorities(newPriorities)
  }

  const clearAll = (event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    updatePriorities([])
  }

  const getButtonText = () => {
    if (selectedPriorities.length === 0) return "Priority"
    if (selectedPriorities.length === 1) return selectedPriorities[0]
    return `(${selectedPriorities.length}) Priority`
  }

  return (
    <div className="flex items-center gap-2 shadow-none">
      <DropdownMenu modal={false}>
        <div
          className={cn(
            "hover:bg-blue-100 rounded-2xl flex items-center",
            selectedPriorities.length === 0 ? "pr-0" : "pr-2 bg-blue-100",
          )}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "h-9 border-none text-primary hover:bg-blue-100 bg-transparent rounded-2xl shadow-none",
                selectedPriorities.length > 0 ? "pr-2" : "",
              )}
            >
              <span className="flex-1 text-left">{getButtonText()}</span>
              {selectedPriorities.length === 0 && <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </DropdownMenuTrigger>

          {selectedPriorities.length > 0 && (
            <button type="button" onClick={clearAll} className="hover:bg-gray-100 rounded-sm p-0.5 ml-1">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <DropdownMenuContent align="start" className="w-48">
          {Object.entries(priorityLabels).map(([key, label]) => {
            const source = key as priority
            return (
              <DropdownMenuCheckboxItem
                key={source}
                checked={selectedPriorities.includes(source)}
                onCheckedChange={(checked) => handlePriorityToggle(source)}
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
