"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { getLocale } from "@/utils/getClientLocale"
import { FormattedMessage } from "react-intl"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    totalElements: number
}

export function PaginationControls({ currentPage, totalPages, totalElements }: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const locale = getLocale() || "en"

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", pageNumber.toString())
        return `?${params.toString()}`
    }

    // Calculate the range display
    const startItem = (currentPage - 1) * 10 + 1
    const endItem = Math.min(currentPage * 10, totalPages * 10)
    const totalItems = totalElements

    const renderPageNumbers = () => {
        const pages = []

        // Show up to 3 pages around current page
        const startPage = Math.max(1, currentPage - 1)
        const endPage = Math.min(totalPages, currentPage + 1)

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => router.push(createPageURL(i))}
                    className={`px-3 py-1 text-sm ${currentPage === i ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    {i}
                </button>,
            )
        }

        return pages
    }

    return (

        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
                {startItem}-{endItem} <FormattedMessage id="of" /> {totalItems}
            </div>

            <div className="flex items-center space-x-1">
                <button
                    onClick={() => router.push(createPageURL(1))}
                    disabled={currentPage <= 1}
                    className={`p-1 ${currentPage <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronsLeft className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className={`p-1 ${currentPage <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronLeft className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>

                {renderPageNumbers()}

                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className={`p-1 ${currentPage >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronRight className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
                <button
                    onClick={() => router.push(createPageURL(totalPages))}
                    disabled={currentPage >= totalPages}
                    className={`p-1 ${currentPage >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronsRight className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
            </div>
        </div>
    )
}
