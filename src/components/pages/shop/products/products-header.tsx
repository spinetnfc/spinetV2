"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"

export default function ProductsHeader() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const totalProducts = 100 // replace with real total products from api

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
    ]

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sortValue = event.target.value
        const newSearchParams = new URLSearchParams(searchParams.toString())

        if (sortValue === "newest") {
            newSearchParams.delete("sort")
        } else {
            newSearchParams.set("sort", sortValue)
        }

        router.push(`?${newSearchParams.toString()}`)
    }

    return (
        <div className="mb-6 sm:flex space-y-2 items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {totalProducts} Products</p>
            <select
                defaultValue={searchParams.get("sort") || "newest"}
                className="rounded-md border p-2 dark:bg-main focus-visible:outline-none"
                onChange={handleSortChange}
            >
                <option value="" disabled>
                    Sort by
                </option>
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
