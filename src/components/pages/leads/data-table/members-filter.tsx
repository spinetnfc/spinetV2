"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, Search, X } from "lucide-react"
import { cn } from '@/utils/cn'

interface Members {
  id: string
  name: string
  avatar?: string
  initials: string
}



export function MembersFilter({
  currentMembers,
  onMembersChange,
}: {
  currentMembers: Members[]
  onMembersChange: (members: Members[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>(["1", "2"])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = currentMembers.filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const selectedMembersData = currentMembers.filter((member) => selectedMembers.includes(member.id))

  const toggleMembers = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

  const removeMembers = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((id) => id !== memberId))
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
            <span className="text-sm text-gray-700">Filter by Members</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", isOpen && "rotate-180")} />
        </div>
      </Button>
      <div>
        {selectedMembersData.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedMembersData.map((member) => (
              <div key={member.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="text-xs bg-gray-300">{member.initials}</AvatarFallback>
                </Avatar>
                <span className="text-gray-700">{member.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMembers(member.id)
                  }}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
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
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleMembers(member.id)}
              >
                <Checkbox
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => toggleMembers(member.id)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">{member.name}</span>
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
