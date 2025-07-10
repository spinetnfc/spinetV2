
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minus, Plus } from 'lucide-react'
import { FormattedMessage } from "react-intl"
import { useRouter, useSearchParams } from "next/navigation"

interface LeadsPaginationControlsProps {
    skip: number
    limit: number
    rowCount: number // number of rows returned in current page
    totalCount: number // total number of items (if known, else can be rowCount+skip)
    onSkipChange: (newSkip: number) => void
    onLimitChange?: (newLimit: number) => void
}

export function LeadsPaginationControls({ skip, limit, rowCount, totalCount, onSkipChange, onLimitChange }: LeadsPaginationControlsProps) {
    const startItem = skip + 1
    const endItem = skip + rowCount
    const totalItems = totalCount
    const searchParams = useSearchParams()
    const router = useRouter()
    const locale = typeof window !== 'undefined' ? (document.documentElement.lang || 'en') : 'en';

    const isFirstPage = skip === 0
    const isLastPage = rowCount < limit
    // TODO: When totalPages is available, use it for page numbers
    // const totalPages = ...
    // const currentPage = ...

    // Calculate current page (1-based)
    const currentPage = Math.floor(skip / limit) + 1;
    // TODO: When totalPages is available, render page numbers
    // const totalPages = ...;

    // Dummy page numbers for now (show only current page)
    const renderPageNumbers = () => {
        // TODO: Replace with real page numbers when totalPages is available
        return [
            <button
                key={currentPage}
                className={
                    `px-3 py-1 text-sm ${"text-blue-600 font-medium"}`
                }
                disabled
            >
                {currentPage}
            </button>
        ];
    };

    // For RTL/Arabic, reverse icon direction
    const rtl = locale === "ar";

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
                {startItem}-{endItem} <FormattedMessage id="of" /> {totalItems}
            </div>
            <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500 hidden sm:block"><FormattedMessage id="rows-per-page" /></span>
                <span className="text-sm text-gray-500 sm:hidden "><FormattedMessage id="rows" /></span>
                <button
                    onClick={() => onLimitChange && onLimitChange(Math.max(5, limit - 1))}
                    disabled={limit <= 1}
                    className={`${limit <= 5 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <Minus className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
                </button>
                <span className="p-1 text-sm text-gray-500">{limit}</span>
                <button
                    onClick={() => onLimitChange && onLimitChange(Math.min(100, limit + 1))}
                    disabled={limit >= 100}
                    className={`${limit >= 100 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <Plus className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
                </button>
                <div className="xs:p-1" />
                <button
                    onClick={() => { }}
                    disabled={isFirstPage}
                    className={`p-1 text-gray-400 cursor-not-allowed`}
                >
                    <ChevronsLeft className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
                </button>
                <button
                    onClick={() => onSkipChange(Math.max(0, skip - limit))}
                    disabled={isFirstPage}
                    className={`p-1 ${isFirstPage ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <ChevronLeft className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => onSkipChange(skip + limit)}
                    disabled={isLastPage}
                    className={`p-1 ${isLastPage ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <ChevronRight className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
                </button>
                <button
                    onClick={() => { }}
                    disabled={isLastPage}
                    className={`p-1 text-gray-400 cursor-not-allowed`}
                >
                    <ChevronsRight className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
                </button>
            </div>
        </div>
    )
} 