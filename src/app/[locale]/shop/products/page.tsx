"use client"

import { Suspense, useState } from "react"
import { ProductGrid } from "@/components/pages/shop/products/products-grid"
import { ProductsFilters } from "@/components/pages/shop/products/products-filters"
import ProductsHeader from "@/components/pages/shop/products/products-header"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"
import { SlidersHorizontal } from "lucide-react"

export default function ProductsPage() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen">
            {/* Header with title and mobile filters button */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Products</h1>
                {/* Mobile: Filters button opens the Drawer */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <button className="md:hidden">
                            < SlidersHorizontal size={30} className="p-1.5 rounded-full bg-gray-300 dark:bg-blue-950 dark:text-white" />
                        </button>
                    </DrawerTrigger>
                    <DrawerContent side="left" className="p-4">
                        {/* Add hidden title/description for accessibility */}
                        <DrawerHeader>
                            <DrawerTitle className="sr-only">Filters</DrawerTitle>
                            <DrawerDescription className="sr-only">
                                Apply filters to products
                            </DrawerDescription>
                        </DrawerHeader>
                        <ProductsFilters />
                    </DrawerContent>
                </Drawer>
            </div>
            {/* Main grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:grid-cols-4">
                {/* Sidebar Filters visible on md and above */}
                <div className="hidden md:block">
                    <ProductsFilters />
                </div>
                {/* Main content */}
                <div className="col-span-2 lg:col-span-3">
                    <ProductsHeader />
                    <Suspense fallback={<LoadingPlaceholder />}>
                        <ProductGrid />
                    </Suspense>
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
