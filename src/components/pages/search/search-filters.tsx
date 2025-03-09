"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormattedMessage } from "react-intl"

interface SearchFiltersProps {
    currentSort: string
}

export function SearchFilters({ currentSort }: SearchFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "popular") {
            params.delete("sort")
        } else {
            params.set("sort", value)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-4">
            <Select defaultValue={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="popular">
                        <FormattedMessage id="popular" />
                    </SelectItem>
                    <SelectItem value="recent">
                        <FormattedMessage id="recent" />
                    </SelectItem>
                    <SelectItem value="rating">
                        <FormattedMessage id="rating" />
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

