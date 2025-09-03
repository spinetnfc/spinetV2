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
export type ContactSource = "manual" | "scan" | "exchange" | "spinet" | "phone"

// 2. Map source keys to labels for UI
const contactSourceLabels: Record<ContactSource, string> = {
  manual: "Manual entry",
  scan: "Device scan",
  exchange: "Exchange sync",
  spinet: "Spinet import",
  phone: "Phone contact",
}

export function ContactSourceFilter({
  handleContactSource,
}: {
  handleContactSource: (sources: ContactSource[]) => void
}) {
  const [selectedSources, setSelectedSources] = useState<ContactSource[]>([])

  const updateSources = (newSources: ContactSource[]) => {
    setSelectedSources(newSources)
    handleContactSource(newSources)
  }

  const handleSourceToggle = (source: ContactSource) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter((s) => s !== source)
      : [...selectedSources, source]

    updateSources(newSources)
  }

  const clearAll = (event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    updateSources([])
  }

  const getButtonText = () => {
    if (selectedSources.length === 0) return "Contact source"
    if (selectedSources.length === 1) return contactSourceLabels[selectedSources[0]]
    return `(${selectedSources.length}) Contact source`
  }

  return (
    <div className="flex items-center gap-2 shadow-none">
      <DropdownMenu modal={false}>
        <div
          className={cn(
            "hover:bg-blue-100 rounded-2xl flex items-center",
            selectedSources.length === 0 ? "pr-0" : "pr-2 bg-blue-100",
          )}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "h-9 border-none text-primary hover:bg-blue-100 bg-transparent rounded-2xl shadow-none",
                selectedSources.length > 0 ? "pr-2" : "",
              )}
            >
              <span className="flex-1 text-left">{getButtonText()}</span>
              {selectedSources.length === 0 && <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </DropdownMenuTrigger>

          {selectedSources.length > 0 && (
            <button type="button" onClick={clearAll} className="hover:bg-gray-100 rounded-sm p-0.5 ml-1">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <DropdownMenuContent align="start" className="w-48">
          {Object.entries(contactSourceLabels).map(([key, label]) => {
            const source = key as ContactSource
            return (
              <DropdownMenuCheckboxItem
                key={source}
                checked={selectedSources.includes(source)}
                onCheckedChange={(checked) => handleSourceToggle(source)}
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
