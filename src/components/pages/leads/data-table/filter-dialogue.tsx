"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { FilterState } from "@/types/leads"
import { MembersFilter } from "./members-filter"
import { TagsFilter } from "./tags-filter"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FilterDialogueProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: FilterState) => void
  currentFilters?: FilterState
}
const selectedMemberss:Members[]=[
  {
    id: "1",
    name: "Olivia Rhye",
    avatar: "/professional-woman-headshot.png",
    initials: "OR",
  },
  {
    id: "2",
    name: "Lana Steiner",
    avatar: "/brunette-professional- .png",
    initials: "LS",
  },
  {
    id: "3",
    name: "Candice Wu",
    avatar: "/woman-professional-headshot-asian.jpg",
    initials: "CW",
  },
  {
    id: "4",
    name: "Phoenix Baker",
    avatar: "/professional-man-headshot.png",
    initials: "PB",
  },
]
interface Members {
  id: string
  name: string
  avatar?: string
  initials: string
}
interface Tag{
  id: string
  tag: string
 
}
const mocktags:Tag[]=[
  { id: "1", tag: "Important" },
  { id: "2", tag: "New" },
  { id: "3", tag: "Urgent" },
  { id: "4", tag: "Later" },
]
export function FilterDialogue({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters = {
     statuses: [],
    priorities: [],
    dateRange: { startDate: "", endDate: "" },
    tags: [],
    searchQuery: "",
  },
}: FilterDialogueProps) {
  const [statuses, setStatuses] = useState(currentFilters.statuses || [])
  const [priorities, setPriorities] = useState(currentFilters.priorities || [])
  const [dateRange, setDateRange] = useState(currentFilters.dateRange || { startDate: "", endDate: "" })
  const [tags, setTags] = useState(currentFilters.tags || [])
  const [searchQuery, setSearchQuery] = useState(currentFilters.searchQuery || "")
  const [selectedMembers, setSelectedMembers] = useState<Members[]>(selectedMemberss)
  useEffect(() => {
    setStatuses(currentFilters.statuses || [])
    setPriorities(currentFilters.priorities || [])
    setDateRange(currentFilters.dateRange || { startDate: "", endDate: "" })
    setTags(currentFilters.tags || [])
    setSearchQuery(currentFilters.searchQuery || "")
  }, [currentFilters])

  const applyFilters = () => {
    onFiltersChange({
      statuses,
      priorities,
      dateRange,
      tags,
      searchQuery: searchQuery.trim(),
    })
  }

  const resetFilters = () => {
    const reset = {
      statuses: [],
      priorities: [],
      dateRange: { startDate: "", endDate: "" },
      tags: [],
      searchQuery: "",
    }
    setStatuses([])
    setPriorities([])
    setDateRange({ startDate: "", endDate: "" })
    setTags([])
    setSearchQuery("")
    onFiltersChange(reset)
  }

  const handleArrayChange = (arr: string[], value: string, checked: boolean) =>
    checked ? [...arr, value] : arr.filter((item) => item !== value)

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-64 bg-white border-r border-border   transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 h-full overflow-y-auto flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filter</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={resetFilters}>
              Reset
            </Button>
          </div>
 
          {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 text-primary">Sort By</h3>

                <RadioGroup
                  value={currentFilters?.searchQuery ?? "newest"}
                  onValueChange={(v) =>
                    onFiltersChange({ ...currentFilters, searchQuery: v })
                  }
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="sort-newest" value="newest" />
                    <Label htmlFor="sort-newest">Newest</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="sort-oldest" value="oldest" />
                    <Label htmlFor="sort-oldest">Oldest</Label>
                  </div>
                </RadioGroup>
              </div>
          {/* Date Range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 text-primary">Date Range</h3>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="mb-2"
            />
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <MembersFilter
            currentMembers={selectedMembers}
            onMembersChange={setSelectedMembers}
          />
          {/* Tags */}
          <TagsFilter
            currentTags={mocktags} onTagsChange={function (tags: Tag[]): void {
              throw new Error("Function not implemented.")
            } }           />

          <div className="mt-8">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
