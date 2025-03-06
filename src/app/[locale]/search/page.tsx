import { Suspense } from "react"
import { SearchTabs } from "@/components/pages/search/search-tabs"
import { PeopleResults } from "@/components/pages/search/people-results"
import { OffersResults } from "@/components/pages/search/offers-results"
import { SearchFilters } from "@/components/pages/search/search-filters"

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Get the active tab from URL or default to "people"
    const activeTab = searchParams.tab || "people"
    const page = Number(searchParams.page) || 1
    const sort = (searchParams.sort as string) || "popular"

    // This would be your server-side data fetching
    // You can fetch data based on the searchParams
    // const peopleData = await fetchPeople({ page, sort, ...otherFilters })
    // const offersData = await fetchOffers({ page, sort, ...otherFilters })

    // For now, we'll use mock data
    const mockPeople = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Jane Cooper ${i + 1}`,
        position: "Position",
        description: "Lorem ipsum dolor sit amet consectetur.",
        coverImage: "/img/abstract.jpeg",
        profileImage: "/img/abstract.jpeg",
    }))

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between mb-6">
                    <SearchTabs activeTab={activeTab as string} />
                    <SearchFilters currentSort={sort} />
                </div>

                <Suspense fallback={<div>Loading results...</div>}>
                    {activeTab === "people" ? (
                        <PeopleResults people={mockPeople} currentPage={page} />
                    ) : (
                        <OffersResults offers={mockOffers} currentPage={page} />
                    )}
                </Suspense>
            </div>
        </div>
    )
}

