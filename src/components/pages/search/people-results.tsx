import { PersonCard } from "./person-card"
import { PaginationControls } from "./pagination-controls"

const ITEMS_PER_PAGE = 12

interface PeopleResultsProps {
    people: any[]
    currentPage: number
}

export function PeopleResults({ people, currentPage }: PeopleResultsProps) {
    const totalPages = Math.ceil(people.length / ITEMS_PER_PAGE)
    const paginatedPeople = people.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedPeople.map((person) => (
                    <PersonCard key={person.id} person={person} />
                ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </div>
    )
}

