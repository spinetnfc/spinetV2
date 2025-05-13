"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchInput() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const [inputValue, setInputValue] = useState(searchParams.get("query") || "")

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams)

            if (inputValue) {
                params.set("query", inputValue)
            } else {
                params.delete("query")
            }

            replace(`${pathname}?${params.toString()}`)
        }, 300) // debounce delay

        return () => clearTimeout(delayDebounce)
    }, [inputValue, pathname, replace, searchParams])

    return (
        <div className="relative w-full max-w-[500px] rounded-full border border-azure">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none ">
                <Search className="h-5 w-5 " />
            </div>
            <input
                className="w-full py-3 pl-10 pr-4 rounded-lg focus:outline-none "
                placeholder="Search for names, tags..."
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
            />
        </div>
    )
}
