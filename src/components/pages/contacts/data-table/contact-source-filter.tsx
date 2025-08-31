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

const contactSources = ["Phone contact", "Google contact", "Device scan", "Manual entry"]

export function ContactSourceFilter({ handleContactSource }: { handleContactSource: (sources: string[]) => void }) {
  const [selectedSources, setSelectedSources] = useState<string[]>([])

  const updateSources = (newSources: string[]) => {
    setSelectedSources(newSources)
    handleContactSource(newSources)
  }

  const handleSourceToggle = (source: string) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter((s) => s !== source)
      : [...selectedSources, source]

    updateSources(newSources)
  }

  const clearAll = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    updateSources([])
  }

  const getButtonText = () => {
    if (selectedSources.length === 0) return "Contact source"
    if (selectedSources.length === 1) return selectedSources[0]
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
              <div className="flex items-center gap-1 ml-2">
                {selectedSources.length === 0 && <ChevronDown className="h-4 w-4" />}
              </div>
            </Button>
          </DropdownMenuTrigger>

          {selectedSources.length > 0 && (
            <button type="button" onClick={clearAll} className="hover:bg-gray-100 rounded-sm p-0.5 ml-1">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <DropdownMenuContent align="start" className="w-48">
          {contactSources.map((source) => (
            <DropdownMenuCheckboxItem
              key={source}
              checked={selectedSources.includes(source)}
              onCheckedChange={(checked) => {
                if (checked && !selectedSources.includes(source)) {
                  handleSourceToggle(source)
                } else if (!checked && selectedSources.includes(source)) {
                  handleSourceToggle(source)
                }
              }}
              onSelect={(e) => {
                e.preventDefault()
              }}
              className="text-gray-700"
            >
              {source}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
