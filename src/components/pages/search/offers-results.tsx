import { OfferCard } from "./offer-card"
import { PaginationControls } from "./pagination-controls"

const ITEMS_PER_PAGE = 12

interface OffersResultsProps {
    offers: any[]
    currentPage: number
}

export function OffersResults({ offers, currentPage }: OffersResultsProps) {
    const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE)
    const paginatedOffers = offers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </div>
    )
}

