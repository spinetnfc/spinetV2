"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface FilterDialogueProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: {
    role?: string
    company?: string
    orderBy: string[]
    sortBy: string
  }) => void
  currentFilters?: {
    role?: string
    company?: string
    orderBy: string[]
    sortBy: string
  }
}

export function FilterDialogue({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters = {
    role: "",
    company: "",
    orderBy: ["activity-count"],
    sortBy: "newest",
  },
}: FilterDialogueProps) {
  const [role, setRole] = useState(currentFilters.role || "")
  const [company, setCompany] = useState(currentFilters.company || "")
  const [orderBy, setOrderBy] = useState<string[]>(currentFilters.orderBy || ["activity-count"])
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "newest")

  useEffect(() => {
    setRole(currentFilters.role || "")
    setCompany(currentFilters.company || "")
    setOrderBy(currentFilters.orderBy || ["activity-count"])
    setSortBy(currentFilters.sortBy || "newest")
  }, [currentFilters])

  const applyFilters = () => {
    onFiltersChange({
      role: role.trim(),
      company: company.trim(),
      orderBy,
      sortBy,
    })
  }

  const resetFilters = () => {
    setRole("")
    setCompany("")
    setOrderBy(["activity-count"])
    setSortBy("newest")
    onFiltersChange({
      role: "",
      company: "",
      orderBy: ["activity-count"],
      sortBy: "newest",
    })
  }

  const handleOrderByChange = (value: string, checked: boolean) => {
    const newOrderBy = checked ? [...orderBy, value] : orderBy.filter((item) => item !== value)
    setOrderBy(newOrderBy)
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      onClick={onClose} // Handle click-to-close on the main container
    >
      {/* Filter Panel - Left Side */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-64 bg-white border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()} // Prevent dialog from closing when clicking inside panel
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filter</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          {/* Order by Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Order by</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activity-count"
                  checked={orderBy.includes("activity-count")}
                  onCheckedChange={(checked) => handleOrderByChange("activity-count", !!checked)}
                />
                <Label htmlFor="activity-count" className="text-sm text-blue-600">
                  Activity Count
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority"
                  checked={orderBy.includes("priority")}
                  onCheckedChange={(checked) => handleOrderByChange("priority", !!checked)}
                />
                <Label htmlFor="priority" className="text-sm">
                  Priority
                </Label>
              </div>
            </div>
          </div>

          {/* Sort by Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Sort by</h3>
            <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest" className="text-sm text-blue-600">
                  Newest
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oldest" id="oldest" />
                <Label htmlFor="oldest" className="text-sm">
                  Oldest
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Organization Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Organization</h3>
            <div className="text-sm text-muted-foreground">No options available</div>
          </div>

          {/* Role Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Role</h3>
            <Input
              placeholder="Enter role..."
              className="w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onBlur={applyFilters}
            />
          </div>

          {/* Company Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Company</h3>
            <Input
              placeholder="Enter company..."
              className="w-full"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onBlur={applyFilters}
            />
          </div>

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
