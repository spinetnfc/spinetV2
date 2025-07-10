import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { FormattedMessage } from "react-intl"

interface LeadsPaginationControlsProps {
    skip: number
    limit: number
    rowCount: number // number of rows returned in current page
    totalCount: number // total number of items (if known, else can be rowCount+skip)
    onSkipChange: (newSkip: number) => void
}

export function LeadsPaginationControls({ skip, limit, rowCount, totalCount, onSkipChange }: LeadsPaginationControlsProps) {
    const startItem = skip + 1
    const endItem = skip + rowCount
    const totalItems = totalCount

    const isFirstPage = skip === 0
    const isLastPage = rowCount < limit

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
                {startItem}-{endItem} <FormattedMessage id="of" /> {totalItems}
            </div>
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => { }}
                    disabled={isFirstPage}
                    className={`p-1 text-gray-400 cursor-not-allowed`}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onSkipChange(Math.max(0, skip - limit))}
                    disabled={isFirstPage}
                    className={`p-1 ${isFirstPage ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onSkipChange(skip + limit)}
                    disabled={isLastPage}
                    className={`p-1 ${isLastPage ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
                <button
                    onClick={() => { }}
                    disabled={isLastPage}
                    className={`p-1 text-gray-400 cursor-not-allowed`}
                >
                    <ChevronsRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
} 