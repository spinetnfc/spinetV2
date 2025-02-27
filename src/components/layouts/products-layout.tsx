"use client";

import { useState } from "react";
import { ProductsFilters } from "@/components/pages/shop/products/products-filters";
import ProductsHeader from "@/components/pages/shop/products/products-header";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

interface ProductsLayoutProps {
    children: React.ReactNode;
    locale: string; // Accept locale as a string prop
}

export default function ProductsLayout({ children, locale }: ProductsLayoutProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Products</h1>
                {/* Mobile Drawer */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <button className="md:hidden">
                            <SlidersHorizontal
                                size={30}
                                className="p-1.5 rounded-full bg-gray-300 dark:bg-blue-950 dark:text-white"
                            />
                        </button>
                    </DrawerTrigger>
                    <DrawerContent
                        side={locale === 'ar' ? 'right' : 'left'}
                        lang={locale}
                        className={cn(
                            'bg-background p-4 h-full fixed top-0 md:hidden',
                            locale === 'ar' ? 'right-0' : 'left-0'
                        )}
                    >
                        <DrawerHeader>
                            <DrawerTitle className="sr-only">Filters</DrawerTitle>
                            <DrawerDescription className="sr-only">
                                Apply filters to products
                            </DrawerDescription>
                        </DrawerHeader>
                        <ProductsFilters locale={locale} /> {/* Pass locale as prop */}
                    </DrawerContent>
                </Drawer>
            </div>
            {/* Main grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:grid-cols-4">
                {/* Sidebar Filters visible on md and above */}
                <div className="hidden md:block">
                    <ProductsFilters locale={locale} /> {/* Pass locale as prop */}
                </div>
                {/* Main content */}
                <div className="col-span-2 lg:col-span-3">
                    <ProductsHeader />
                    {children}
                </div>
            </div>
        </div>
    );
}