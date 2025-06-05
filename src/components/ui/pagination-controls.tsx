"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const locale = pathname.split("/")[1]; // 'en', 'ar', 'fr', etc.

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", pageNumber.toString())
        return `?${params.toString()}`
    }

    return (
        <div className="flex items-center justify-center my-4">
            <nav className="flex items-center gap-1">
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-md border ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100  dark:hover:bg-gray-800"
                        }`}
                    aria-label="Previous page"
                >
                    <ChevronLeft className={`h-5 w-5 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>

                <div className="flex items-center">
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => router.push(createPageURL(page))}
                                    className={`w-10 h-10 rounded-md mx-1 ${currentPage === page ? "bg-[#001838] text-white" : "border hover:bg-gray-100  dark:hover:bg-gray-800"
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
                </div>

                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className={`p-2 rounded-md border ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    aria-label="Next page"
                >
                    <ChevronRight className={`h-5 w-5 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
            </nav>
        </div>
    )
}

