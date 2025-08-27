"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Filter } from "lucide-react"
import { cn } from "@/lib/utils" // if you have a helper

interface ContactSourceFilterProps {
  isOpen: boolean
  onClose: () => void
}

const contactSources = ["Phone contact", "Google contact", "Device scan", "Manual entry"]

export function ContactSourceFilter({ isOpen, onClose }: ContactSourceFilterProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(["Manual entry"])
  const [multiSelectSources, setMultiSelectSources] = useState<string[]>(["Google contact", "Manual entry"])

  const removeSelectedSource = (source: string) => {
    setSelectedSources((prev) => prev.filter((s) => s !== source))
  }

  const toggleMultiSelectSource = (source: string) => {
    setMultiSelectSources((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
   <DialogContent
  className={cn(
    "max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none shadow-none ",
 
  )}
>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">filter by contact source&gt;contacts</span>
          </div>

          <div className="space-y-6">
            {/* First Contact Source Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Select defaultValue="contact-source">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Contact source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact-source">Contact source</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  {selectedSources.map((source) => (
                    <div
                      key={source}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {source}
                      <button onClick={() => removeSelectedSource(source)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    Manual entry
                    <X className="w-3 h-3" />
                  </div>
                  {contactSources.map((source) => (
                    <div key={source} className="text-sm text-gray-700">
                      {source}
                    </div>
                  ))}
                  <Select defaultValue="manual-entry">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual-entry">Manual entry</SelectItem>
                      {contactSources.map((source) => (
                        <SelectItem key={source} value={source.toLowerCase().replace(" ", "-")}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contact source</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  {contactSources.map((source) => (
                    <div key={source} className="text-sm text-gray-700">
                      {source}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Contact Source Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  ({multiSelectSources.length}) Contact source
                  <X className="w-3 h-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    ({multiSelectSources.length}) Contact source
                    <X className="w-3 h-3" />
                  </div>
                  {contactSources.map((source) => (
                    <div key={source} className="text-sm text-gray-700">
                      {source}
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">({multiSelectSources.length}) Contact source</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  {contactSources.map((source) => (
                    <div key={source} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{source}</span>
                      <Checkbox
                        checked={multiSelectSources.includes(source)}
                        onCheckedChange={() => toggleMultiSelectSource(source)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
