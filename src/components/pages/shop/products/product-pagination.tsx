"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { FormattedMessage } from "react-intl"

export function ProductPagination({
    locale,
    currentPage,
    totalPages,
}: {
    locale: string
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
            <Button
                onClick={() => router.push(createPageURL(currentPage - 1))}
                disabled={currentPage <= 1}
                className="rounded-lg border p-2 disabled:opacity-50  me-auto"
                icon={locale !== "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                iconPosition="left"
            >
                <FormattedMessage id="previous" />
            </Button>
            {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                        <button
                            key={page}
                            onClick={() => router.push(createPageURL(page))}
                            className={`rounded-md w-8 aspect-square ${currentPage === page ? "bg-gray-300 dark:bg-blue-950 border" : "hover:bg-gray-100 hover:text-main"
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
            <Button
                onClick={() => router.push(createPageURL(currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-lg border p-2 disabled:opacity-50  ms-auto"
                icon={locale !== "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                iconPosition="right"
            >
                <FormattedMessage id="next" />
            </Button>
        </div>
    )
}

