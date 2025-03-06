"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { useIntl } from "react-intl" // Import useIntl

export function SearchBar() {
    const intl = useIntl() // Get intl object for translations
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const pathname = usePathname()

    // Update search query state when URL changes
    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "")
    }, [searchParams])

    const handleSearch = useCallback(
        (query: string) => {
            const params = new URLSearchParams(searchParams.toString())

            // Set or delete the query parameter
            if (query) {
                params.set("q", query)
            } else {
                params.delete("q")
            }

            // Make sure we have a tab parameter (default to "people")
            if (!params.has("tab")) {
                params.set("tab", "people")
            }

            // Stay on the current page, just update the query parameters
            router.push(`${pathname}?${params.toString()}`)
        },
        [router, searchParams, pathname],
    )

    // Get translated placeholder text
    const placeholderText = intl.formatMessage({
        id: "search-people-and-offers",
        defaultMessage: "Search people and offers",
    })

    return (
        <div className="flex-1 flex items-center gap-1 xs:gap-2 h-8 xs:h-10 w-full max-w-[600px] px-2 bg-white rounded-full">
            <button onClick={() => handleSearch(searchQuery)} className="cursor-pointer">
                <Search height={20} width={20} color="gray" />
            </button>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                placeholder={placeholderText} // Use translated string
                className="w-full focus:outline-none text-sm xs:text-md text-gray-900 placeholder:text-gray-400"
            />
        </div>
    )
}

