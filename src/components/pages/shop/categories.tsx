"use client"

import Link from "next/link"

interface Category {
    name: string
    href: string
    className?: string
}

interface BrowseCategoriesProps {
    title: string
    locale: string
}

const categories: Category[] = [
    { name: "Card", href: "/shop/products?productCategory=card" },
    { name: "Sticker", href: "/shop/products?productCategory=sticker" },
    {
        name: "Personalized Pack",
        href: "/shop/products?productCategory=personalized-pack",
    },
    { name: "Keychain", href: "/shop/products?productCategory=keychain" },
]

export function BrowseCategories({ title, locale }: BrowseCategoriesProps) {
    return (
        <div className="bg-navy p-6 md:p-8 rounded-3xl mt-8">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">{title}</h2>
            {/* Mobile layout (vertical) */}
            <div className="flex flex-col gap-4 sm:hidden">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={`/${locale}${category.href}`}
                        className="block bg-blue-100 rounded-2xl p-6 h-24 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10"
                    >
                        <span className="text-navy text-lg font-semibold">{category.name}</span>
                    </Link>
                ))}
            </div>

            {/* Desktop layout with custom width distribution */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-4">
                {/* Top row */}
                <Link
                    href={`/${locale}${categories[0].href}`}
                    className="col-span-3 block bg-blue-100 rounded-2xl p-6 h-32 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10"
                >
                    <span className="text-navy text-lg font-semibold">{categories[0].name}</span>
                </Link>
                <Link
                    href={`/${locale}${categories[1].href}`}
                    className="col-span-2 block bg-blue-100 rounded-2xl p-6 h-32 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10"
                >
                    <span className="text-navy text-lg font-semibold">{categories[1].name}</span>
                </Link>

                {/* Bottom row */}
                <Link
                    href={`/${locale}${categories[2].href}`}
                    className="col-span-2 block bg-blue-100 rounded-2xl p-6 h-32 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10"
                >
                    <span className="text-navy text-lg font-semibold">{categories[2].name}</span>
                </Link>
                <Link
                    href={`/${locale}${categories[3].href}`}
                    className="col-span-3 block bg-blue-100 rounded-2xl p-6 h-32 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10"
                >
                    <span className="text-navy text-lg font-semibold">{categories[3].name}</span>
                </Link>
            </div>
        </div>
    )
}

