"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ProductPagination } from "./product-pagination"
import { MOCK_PRODUCTS, ITEMS_PER_PAGE, type Product } from "@/mockdata/products"
import ProductCard from "./product-card"

export function ProductGrid({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const params = useSearchParams()

    // Filter and sort products
    const filterProducts = () => {
        let filtered = [...MOCK_PRODUCTS]

        // Apply category filter
        const categories = params.getAll("category")
        if (categories.length > 0) {
            filtered = filtered.filter((product) => categories.includes(product.type))
        }

        // Apply color filter
        const colors = params.getAll("color")
        if (colors.length > 0) {
            filtered = filtered.filter((product) => colors.includes(product.color))
        }

        // Apply size filter
        const sizes = params.getAll("size")
        if (sizes.length > 0) {
            filtered = filtered.filter((product) => sizes.includes(product.size))
        }

        // Apply search query
        const query = params.get("q")?.toLowerCase()
        if (query) {
            filtered = filtered.filter((product) => product.name.toLowerCase().includes(query))
        }

        // Apply sorting
        const sort = params.get("sort")
        if (sort) {
            switch (sort) {
                case "price-asc":
                    filtered.sort((a, b) => a.price - b.price)
                    break
                case "price-desc":
                    filtered.sort((a, b) => b.price - a.price)
                    break
                case "newest":
                    filtered.sort((a, b) => b.id - a.id)
                    break
            }
        }

        return filtered
    }

    const filteredProducts = filterProducts()
    const page = Number(params.get("page")) || 1
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {totalPages > 1 && <ProductPagination currentPage={page} totalPages={totalPages} />}
        </div>
    )
}



