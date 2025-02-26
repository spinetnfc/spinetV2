"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

export function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

    const handleSearch = useCallback(
        (query: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (query) {
                params.set("q", query)
            } else {
                params.delete("q")
            }
            router.push(`?${params.toString()}`)
        },
        [router, searchParams],
    )

    return (
        <div className="flex-1 flex items-center gap-1 xs:gap-2 h-8 xs:h-10 w-full max-w-[600px] px-2 bg-white rounded-full">
            <button onClick={() => handleSearch(searchQuery)}>
                <Search height={20} width={20} color="gray" />
            </button>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                placeholder="Search for products"
                className="w-full focus:outline-none text-sm xs:text-md text-gray-900 placeholder:text-gray-400"
            />
        </div>
    )
}

