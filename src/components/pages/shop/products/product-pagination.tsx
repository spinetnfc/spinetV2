"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function ProductPagination({
    currentPage,
    totalPages,
}: {
    currentPage: number
    totalPages: number
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", pageNumber.toString())
        return `?${params.toString()}`
    }

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                onClick={() => router.push(createPageURL(currentPage - 1))}
                disabled={currentPage <= 1}
                className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50"
            >
                Previous
            </button>
            {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                        <button
                            key={page}
                            onClick={() => router.push(createPageURL(page))}
                            className={`rounded-md p-2 ${currentPage === page ? "bg-blue-500 text-white" : "border hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    )
                } else if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                    return (
                        <span key={page} className="px-2">
                            ...
                        </span>
                    )
                }
                return null
            })}
            <button
                onClick={() => router.push(createPageURL(currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    )
}

