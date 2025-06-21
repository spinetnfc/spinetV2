"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minus, Plus } from 'lucide-react'
import { getLocale } from "@/utils/getClientLocale"
import { FormattedMessage } from "react-intl"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    totalElements: number
    rowsPerPage: number
}

export function PaginationControls({ currentPage, totalPages, totalElements, rowsPerPage }: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const locale = getLocale() || "en"

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", pageNumber.toString())
        params.set("rowsPerPage", rowsPerPage.toString())
        return `?${params.toString()}`
    }

    // New function to handle rowsPerPage changes
    const createRowsPerPageURL = (newRowsPerPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", "1") // Reset to page 1 when changing rows per page
        params.set("rowsPerPage", newRowsPerPage.toString())
        return `?${params.toString()}`
    }

    // Calculate the range display using dynamic rowsPerPage
    const startItem = (currentPage - 1) * rowsPerPage + 1
    const endItem = Math.min(currentPage * rowsPerPage, totalElements)
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
                <span className="text-sm text-gray-500 hidden sm:block"><FormattedMessage id="rows-per-page" /></span>
                <span className="text-sm text-gray-500 sm:hidden "><FormattedMessage id="rows" /></span>
                <button
                    onClick={() => router.push(createRowsPerPageURL(Math.max(5, rowsPerPage - 1)))}
                    disabled={rowsPerPage <= 1}
                    className={`${rowsPerPage <= 5 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <Minus className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
                <span className="p-1 text-sm text-gray-500">{rowsPerPage}</span>
                <button
                    onClick={() => router.push(createRowsPerPageURL(Math.min(100, rowsPerPage + 1)))}
                    disabled={rowsPerPage >= 100}
                    className={`${rowsPerPage >= 100 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <Plus className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
                <div className="xs:p-1" />
                <button
                    onClick={() => router.push(createPageURL(1))}
                    disabled={currentPage <= 1}
                    className={`p-1 ${currentPage <= 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronsLeft className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className={`p-1 ${currentPage <= 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronLeft className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>

                {renderPageNumbers()}

                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className={`p-1 ${currentPage >= totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronRight className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
                <button
                    onClick={() => router.push(createPageURL(totalPages))}
                    disabled={currentPage >= totalPages}
                    className={`p-1 ${currentPage >= totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                >
                    <ChevronsRight className={`h-4 w-4 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
            </div>
        </div>
    )
}