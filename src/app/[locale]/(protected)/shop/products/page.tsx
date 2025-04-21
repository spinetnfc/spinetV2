import { Suspense } from "react";
import ProductsLayout from "@/components/layouts/products-layout"; // Import the layout
import { ProductGrid } from "@/components/pages/shop/products/products-grid";

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
    );
}

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params; // Resolve the Promise to get the string

    return (
        <ProductsLayout locale={locale}>
            <Suspense fallback={<LoadingPlaceholder />}>
                <ProductGrid locale={locale} />
            </Suspense>
        </ProductsLayout>
    );
}