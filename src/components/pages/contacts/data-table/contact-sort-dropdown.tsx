"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ContactSortDropdown() {
  const [selectedSort, setSelectedSort] = useState("name-asc")

  const sortOptions = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "date-asc", label: "Oldest First" },
    { value: "date-desc", label: "Newest First" },
  ]

  const handleSortChange = (value: string) => {
    setSelectedSort(value)
    // Note: This would typically update URL params or call a parent callback
    console.log("[v0] Sort changed to:", value)
  }

  const currentSortLabel = sortOptions.find((option) => option.value === selectedSort)?.label || "Sort"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <span className="sr-only">Sort contacts</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={selectedSort === option.value ? "bg-accent" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
