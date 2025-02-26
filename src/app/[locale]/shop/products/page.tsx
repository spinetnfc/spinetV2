"use client"
import { Suspense } from "react"
import { ProductGrid } from "@/components/pages/shop/products/products-grid"
import { ProductsFilters } from "@/components/pages/shop/products/products-filters"
import ProductsHeader from "@/components/pages/shop/products/products-header"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
    const searchParams = useSearchParams()

    // Convert `ReadonlyURLSearchParams` to a plain object
    const searchParamsObject = Object.fromEntries(searchParams.entries())

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <ProductsFilters />
                    <div className="lg:col-span-3">
                        <ProductsHeader />
                        <Suspense fallback={<LoadingPlaceholder />}>
                            <ProductGrid searchParams={searchParamsObject} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}


function LoadingPlaceholder() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-square w-full rounded-lg bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-6 w-1/3 rounded bg-gray-200" />
                    <div className="h-10 w-full rounded bg-gray-200" />
                </div>
            ))}
        </div>
    )
}

