import { OfferCard } from "@/components/pages/search/offer-card"

interface RelatedOffersProps {
    offers: Array<{
        id: number
        title: string
        description: string
        coverImage: string
        rating: number
        likes: number
        views: number
        author: {
            name: string
            image: string
        }
    }>
}

export function RelatedOffers({ offers }: RelatedOffersProps) {
    return (
        <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
        </section>
    )
}

