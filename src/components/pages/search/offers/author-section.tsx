import Image from "next/image"
import Link from "next/link"
import { OfferCard } from "@/components/pages/search/offer-card"

interface AuthorSectionProps {
    author: {
        id: string
        name: string
        image: string
        bio: string
    }
    moreOffers: Array<{
        id: number
        title: string
        description: string
        mainImage: string
        thumbnails: string[]
        stats: {
            likes: number
            views: number
        }
    }>
}

export function AuthorSection({ author, moreOffers }: AuthorSectionProps) {
    // Transform moreOffers to match the OfferCard component's expected structure
    const formattedOffers = moreOffers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        coverImage: offer.mainImage,
        rating: 5.0, // Default rating since it's not in the original data
        likes: offer.stats.likes,
        views: offer.stats.views,
        author: {
            name: author.name,
            image: author.image,
        },
    }))

    return (
        <section className="mt-16 border-t border-gray-700 pt-16">
            {/* Author Profile Section - Centered at the top */}
            <div className="flex flex-col items-center text-center mb-12">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                        src={author.image || "/placeholder.svg"}
                        alt={author.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                </div>
                <p className="text-gray-300 mb-4">{author.bio}</p>
                <button className="bg-[#001838] hover:bg-[#002857] text-white px-8 py-2 rounded-md transition-colors">
                    Button Text
                </button>
            </div>

            {/* More Offers Section */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">More by {author.name}</h2>
                <Link href={`/profile/${author.id}`} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    View Profile
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6 12L10 8L6 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>

            {/* Grid of Offer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {formattedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
        </section>
    )
}

