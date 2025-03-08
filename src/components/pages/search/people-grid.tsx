"use client"

import { useSearchParams } from "next/navigation"
import { PersonCard } from "./person-card"
import { PaginationControls } from "@/components/ui/pagination-controls"

const ITEMS_PER_PAGE = 12

export function PeopleGrid() {
    const searchParams = useSearchParams()
    const page = Number(searchParams.get("page")) || 1

    // This would come from your API
    const mockPeople = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Jane Cooper ${i + 1}`,
        position: "Position",
        description: "Lorem ipsum dolor sit amet consectetur.",
        coverImage: "/img/abstract.jpeg",
        profileImage: "/img/abstract.jpeg",
    }))

    const paginatedPeople = mockPeople.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedPeople.map((person) => (
                    <PersonCard key={person.id} person={person} />
                ))}
            </div>
            <PaginationControls currentPage={page} totalPages={Math.ceil(mockPeople.length / ITEMS_PER_PAGE)} />
        </div>
    )
}

