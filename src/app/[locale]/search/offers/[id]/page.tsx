import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { OfferContent } from "@/components/pages/search/offers/offer-content"
import { OfferHeader } from "@/components/pages/search/offers/offer-header"
import { OfferGallery } from "@/components/pages/search/offers/offer-gallery"
import Reviews from "@/components/pages/shop/Reviews/reviews"
import { AuthorSection } from "@/components/pages/search/offers/author-section"
import { RelatedOffers } from "@/components/pages/search/offers/related-offers"

interface OfferPageProps {
    params: Promise<{
        id: string
        locale: string
    }>
}

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
    // In a real app, fetch the offer data here
    return {
        title: "Frontend Development Offer",
        description: "Learn frontend development with our comprehensive course",
    }
}

export default async function OfferPage({ params }: OfferPageProps) {


    const offer = {
        id: (await params).id,
        title: "Frontend Development",
        category: "Development",
        author: {
            name: "Jane Cooper",
            image: "/img/abstract.jpeg",
            role: "Senior Developer",
        },
        bannerImage: "/img/abstract.jpeg",
        description: `Lorem ipsum dolor sit amet consectetur. Gravida cursus nisl arcu diam eu quam sed natoque bibendum. Erat cursus turpis pellentesque accumsan sit egestas eu velit lorem. Nisl suscipit tellus quam augue elementum amet ac cras est. Cum cras nisl in nibh auctor quisque non. In vestibulum risus orci pulvinar condimentum eu nunc. Id egestas id faucenas commodo non. At pretium nulla vulputate pharetra sit bibendum egestas. At a nunc aliquam egestas tellus et vel tellus.`,
        mainImage: "/img/abstract.jpeg",
        gallery: ["/img/abstract.jpeg", "/img/abstract.jpeg", "/img/abstract.jpeg"],
        videoUrl: "https://example.com/video.mp4",
        rating: 4.8,
        reviews: 128,
        likes: 450,
        views: 12000,
    }

    const moreOffers = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        title: "Lorem ipsum",
        description:
            "Lorem ipsum dolor sit amet consectetur. Varius sed augue praesent facilisis. Amet malesuada vitae nisl ut integer. Suspendisse fames id neque magna turpis a...",
        mainImage: "/img/abstract.jpeg",
        thumbnails: ["/img/abstract.jpeg", "/img/abstract.jpeg", "/img/abstract.jpeg"],
        stats: {
            likes: 453,
            views: 62.8,
        },
    }))

    // Format related offers to match the structure expected by OfferCard
    const relatedOffers = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: "FRONT END",
        description:
            "Lorem ipsum dolor sit amet consectetur. Varius sed augue praesent facilisis. Amet malesuada vitae nisl ut integer. Suspendisse fames id neque magna turpis a...",
        coverImage: "/img/abstract.jpeg",
        rating: 5.0,
        likes: 453,
        views: 62.8,
        author: {
            name: i % 2 === 0 ? "Robert Fox" : "Wade Warren",
            image: "/img/abstract.jpeg",
        },
    }))

    const { locale } = await params;
    if (!offer) {
        notFound()
    }

    return (
        <main className="min-h-screen">
            <div className="max-w-[90%] mx-auto py-8">
                <OfferHeader offer={offer} />
                <OfferContent offer={offer} />
                <OfferGallery images={offer.gallery} videoUrl={offer.videoUrl} />
                <Reviews locale={locale} />
                <AuthorSection
                    locale={locale}
                    author={{
                        id: "jane-cooper",
                        name: offer.author.name,
                        image: offer.author.image,
                        bio: "Lorem ipsum dolor sit amet consectetur",
                    }}
                    moreOffers={moreOffers}
                />
                <RelatedOffers relatedOffers={relatedOffers} />

            </div>
        </main>
    )
}

