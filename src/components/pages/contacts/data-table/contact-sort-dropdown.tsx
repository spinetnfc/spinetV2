"use client"

import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { FormattedMessage } from "react-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc"

interface ContactSortDropdownProps {
    themeColor: string
}

export function ContactSortDropdown({ themeColor }: ContactSortDropdownProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const currentSort = (searchParams.get("sort") as SortOption) || "name-asc"

    const handleSortChange = (sort: SortOption) => {
        const params = new URLSearchParams(searchParams)

        if (sort === "name-asc") {
            params.delete("sort")
        } else {
            params.set("sort", sort)
        }

        replace(`${pathname}?${params.toString()}`)
    }

    const getSortLabel = (sort: SortOption) => {
        switch (sort) {
            case "name-asc":
                return "name-desc"
            case "name-desc":
                return "name-asc"
            case "date-asc":
                return "date-desc"
            case "date-desc":
                return "date-asc"
            default:
                return "name-desc"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    style={{ color: themeColor, borderColor: themeColor }}
                    className="flex items-center gap-2"
                >
                    <FormattedMessage id={getSortLabel(currentSort)} />
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSortChange("name-asc")}>
                    <FormattedMessage id="name-desc" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("name-desc")}>
                    <FormattedMessage id="name-asc" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("date-asc")}>
                    <FormattedMessage id="date-desc" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("date-desc")}>
                    <FormattedMessage id="date-asc" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}