"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, Search, X } from "lucide-react"
import { cn } from '@/utils/cn'

interface Tag {
  id: string
  tag: string

}



export function TagsFilter({
  currentTags,
  onTagsChange,
}: {
  currentTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(["1", "2"])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTags = currentTags.filter((tag) => tag.tag.toLowerCase().includes(searchQuery.toLowerCase()))

  const selectedTagsData = currentTags.filter((tag) => selectedTags.includes(tag.id))

  const toggleTags = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    )
  }

  const removeTags = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId))
  }

  return (
    <div className="relative w-full max-w-sm flex flex-col gap-2">
      {/* Filter Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="h-auto p-3 justify-start text-left font-normal   bg-white hover:bg-blue-100 w-full"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-primary">Filter by Tags</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", isOpen && "rotate-180")} />
        </div>
      </Button>
      {selectedTagsData.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTagsData.map((tag) => (
            <div key={tag.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs">
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-xs bg-gray-300">{tag.tag[0]}</AvatarFallback>
              </Avatar>
              <span className="text-primary">{tag.tag}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeTags(tag.id)
                }}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}


      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleTags(tag.id)}
              >
                <Checkbox
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTags(tag.id)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                    {tag.tag[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">{tag.tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
