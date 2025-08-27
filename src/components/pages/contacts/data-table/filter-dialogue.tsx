"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils" // helper if you use it

interface FilterDialogueProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDialogue({ isOpen, onClose }: FilterDialogueProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-transparent transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Filter Panel - Left Side */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-64 bg-white border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filter</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                console.log("Reset filters")
              }}
            >
              Reset
            </Button>
          </div>

          {/* Order by Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Order by</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="activity-count" defaultChecked />
                <Label htmlFor="activity-count" className="text-sm text-blue-600">
                  Activity Count
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="priority" />
                <Label htmlFor="priority" className="text-sm">
                  Priority
                </Label>
              </div>
            </div>
          </div>

          {/* Sort by Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Sort by</h3>
            <RadioGroup defaultValue="newest" className="space-y-2">
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
            <Input placeholder="Enter role..." className="w-full" />
          </div>

          {/* Company Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Company</h3>
            <Input placeholder="Enter company..." className="w-full" />
          </div>
        </div>
      </div>

      {/* Overlay - Click to Close */}
      <div
        className="absolute inset-0 bg-transparent cursor-pointer"
        onClick={onClose}
      />
    </div>
  )
}
