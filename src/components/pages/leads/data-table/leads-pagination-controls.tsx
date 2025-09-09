"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, Minus, Plus } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface LeadsPaginationControlsProps {
  skip: number
  limit: number
  rowCount: number
  totalCount: number
  hasNextPage?: boolean
  onSkipChange: (newSkip: number) => void
  onLimitChange?: (newLimit: number) => void
}

export function LeadsPaginationControls({
  skip,
  limit,
  rowCount,
  totalCount,
  hasNextPage = false,
  onSkipChange,
  onLimitChange,
}: LeadsPaginationControlsProps) {
  const startItem = skip + 1
  const endItem = skip + rowCount
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const locale = typeof window !== "undefined" ? document.documentElement.lang || "en" : "en"

  const isFirstPage = skip === 0
  const isLastPage = !hasNextPage

  const currentPage = Math.floor(skip / limit) + 1
  const estimatedTotalPages = hasNextPage ? currentPage + 1 : currentPage

  const goToFirstPage = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1")
    params.delete("skip")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    onSkipChange(0)
  }

  const goToPreviousPage = () => {
    const newSkip = Math.max(0, skip - limit)
    const newPage = Math.floor(newSkip / limit) + 1
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    onSkipChange(newSkip)
  }

  const goToNextPage = () => {
    if (!isLastPage) {
      const newSkip = skip + limit
      const newPage = Math.floor(newSkip / limit) + 1
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      onSkipChange(newSkip)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 3

    const startPage = Math.max(1, currentPage - 1)
    const endPage = hasNextPage ? currentPage + 1 : currentPage

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            const newSkip = (i - 1) * limit
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", i.toString())
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
            onSkipChange(newSkip)
          }}
          className={`px-3 py-1 text-sm rounded ${
            i === currentPage ? "bg-blue-600 text-white font-medium" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      )
    }
    return pages
  }

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("rowsPerPage", newLimit.toString())
    params.set("page", "1")
    params.delete("skip")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    onLimitChange?.(newLimit)
  }

  const rtl = locale === "ar"

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-200 gap-4">
      <div className="text-sm text-gray-500">
        {startItem}-{endItem} of {hasNextPage ? `${totalCount}+` : totalCount}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 hidden sm:block">Rows per page</span>
          <span className="text-sm text-gray-500 sm:hidden">Rows</span>
          <button
            onClick={() => handleLimitChange(Math.max(5, limit - 5))}
            disabled={limit <= 5}
            className={`p-1 ${limit <= 5 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
          >
            <Minus className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
          </button>
          <span className="px-2 py-1 text-sm text-gray-700 min-w-[2rem] text-center">{limit}</span>
          <button
            onClick={() => handleLimitChange(Math.min(100, limit + 5))}
            disabled={limit >= 100}
            className={`p-1 ${limit >= 100 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
          >
            <Plus className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={goToFirstPage}
            disabled={isFirstPage}
            className={`p-1 ${isFirstPage ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
          >
            <ChevronsLeft className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
          </button>
          <button
            onClick={goToPreviousPage}
            disabled={isFirstPage}
            className={`p-1 ${isFirstPage ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
          >
            <ChevronLeft className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
          </button>

          <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

          <button
            onClick={goToNextPage}
            disabled={isLastPage}
            className={`p-1 ${isLastPage ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
          >
            <ChevronRight className={`h-4 w-4 ${rtl ? "-scale-100" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
