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

    const renderPageNumbers = () => {
        const pages = [];

        // Always show the first page
        pages.push(
            <button
                key={1}
                onClick={() => router.push(createPageURL(1))}
                className={`w-10 h-10 rounded-md mx-1 ${currentPage === 1 ? "bg-[#001838] text-white" : "border hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
                1
            </button>
        );

        // Add dots if currentPage > 3
        if (currentPage > 2) {
            pages.push(<span key="start-ellipsis" className="px-2">...</span>);
        }

        // Show currentPage if it's not 1 or totalPages
        if (currentPage !== 1 && currentPage !== totalPages) {
            pages.push(
                <button
                    key={currentPage}
                    onClick={() => router.push(createPageURL(currentPage))}
                    className="w-10 h-10 rounded-md mx-1 bg-[#001838] text-white"
                >
                    {currentPage}
                </button>
            );
        }

        // Add dots if currentPage < totalPages - 2
        if (currentPage < totalPages - 1) {
            pages.push(<span key="end-ellipsis" className="px-2">...</span>);
        }

        // Always show the last page if totalPages > 1
        if (totalPages > 1) {
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => router.push(createPageURL(totalPages))}
                    className={`w-10 h-10 rounded-md mx-1 ${currentPage === totalPages ? "bg-[#001838] text-white" : "border hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center my-4">
            <nav className="flex items-center gap-1">
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-md border ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100  dark:hover:bg-gray-800"}`}
                    aria-label="Previous page"
                >
                    <ChevronLeft className={`h-5 w-5 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>

                <div className="flex items-center">
                    {renderPageNumbers()}
                </div>

                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className={`p-2 rounded-md border ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    aria-label="Next page"
                >
                    <ChevronRight className={`h-5 w-5 ${locale === "ar" ? "-scale-100" : ""}`} />
                </button>
            </nav>
        </div>
    );
}
