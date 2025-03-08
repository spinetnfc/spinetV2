"use client"

import { useSearchParams } from "next/navigation"
import { OfferCard } from "./offer-card"
import { PaginationControls } from "@/components/ui/pagination-controls"

const ITEMS_PER_PAGE = 12

export function OffersGrid() {
    const searchParams = useSearchParams()
    const page = Number(searchParams.get("page")) || 1

    // This would come from your API
    const mockOffers = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: "FRONT END",
        description:
            "Lorem ipsum dolor sit amet consectetur. Varius sed augue praesent facilisis. Amet malesuada vitae nisl ut integer. Suspendisse fames id neque magna turpis accumsan sed...",
        coverImage: "/img/abstract.jpeg",
        rating: 5.0,
        likes: 453,
        views: 62.8,
        author: {
            name: "Jerome Bell",
            image: "/img/abstract.jpeg",
        },
    }))

    const paginatedOffers = mockOffers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
            <PaginationControls currentPage={page} totalPages={Math.ceil(mockOffers.length / ITEMS_PER_PAGE)} />
        </div>
    )
}

