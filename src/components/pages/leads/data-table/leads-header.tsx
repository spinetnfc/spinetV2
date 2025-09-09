"use client"

import type { ChangeEvent } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface LeadsHeaderProps {
  leadsCount: number
  searchValue: string
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function LeadsHeader({ leadsCount, searchValue, onSearchChange }: LeadsHeaderProps) {
  const router = useRouter()
  return (
    <div className="bg-white border-b border-gray-300 px-6 py-4.75 w-full h-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {leadsCount} lead{leadsCount !== 1 ? "s" : ""}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search lead, title..."
              value={searchValue}
              onChange={onSearchChange}
              className="pl-10 w-64 rounded-2xl"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-white text-blue-600">
            Import
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/app/leads/add-lead")}>
            <Plus className="w-4 h-4" />
            Add lead
          </Button>
        </div>
      </div>
    </div>
  )
}
