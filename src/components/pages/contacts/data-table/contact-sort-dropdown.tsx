"use client"

import { ChevronDown } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"

export function ContactSortDropdown() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentSort = searchParams.get("sort") || "name-asc"

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("sort", sort)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSortChange("name-asc")}>Name A-Z</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("name-desc")}>Name Z-A</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("date-asc")}>Date Added (Oldest)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("date-desc")}>Date Added (Newest)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
