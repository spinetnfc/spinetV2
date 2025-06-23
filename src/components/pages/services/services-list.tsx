"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { ServicesData, ServicesSearchParams } from "@/types/services"
import { SerachServicesAction } from "@/actions/services"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormattedMessage, useIntl } from "react-intl"

type ServicesCardListProps = {
    services: ServicesData[]
    locale: string
    userId: string | null
    searchParams: ServicesSearchParams
}

export function ServicesCardList({ services: initialServices, locale, userId, searchParams: initialSearchParams }: ServicesCardListProps) {
    const [services, setServices] = useState(initialServices)
    const [searchTerm, setSearchTerm] = useState(initialSearchParams.term || "")
    const urlSearchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const intl = useIntl()

    // Show loading spinner if userId is null
    if (userId === null) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    const handleSearch = async () => {
        // Update URL with new search params
        const params = new URLSearchParams(urlSearchParams.toString())
        if (searchTerm) {
            params.set("term", searchTerm)
        } else {
            params.delete("term")
        }

        // Update URL
        const newParamsString = params.toString()
        if (newParamsString !== urlSearchParams.toString()) {
            replace(`${pathname}?${newParamsString} `, { scroll: false })
        }

        // Fetch new services
        const searchParams: ServicesSearchParams = {
            ...initialSearchParams,
            term: searchTerm,
        }
        const response = await SerachServicesAction(userId, searchParams)
        if (response.success && response.data) {
            setServices(response.data)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-4 items-center border-1 border-gray-300 dark:border-azure w-fit rounded-lg">
                <Input
                    placeholder={intl.formatMessage({ id: "search-services", defaultMessage: "Search services..." })}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="max-w-sm border-none min-w-60 sm:min-w-80"
                />
                <Button variant="ghost" size="icon" onClick={handleSearch}>
                    <Search className="h-5 w-5 text-gray-400 dark:text-azure" />
                </Button>
            </div>

            {/* Services Cards */}
            {services.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={`${service.Profile._id} -${index} `}
                            className="rounded-lg border bg-white p-4 shadow-sm"
                        >
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <p className="text-sm">
                                Provider: {service.Profile.firstName} {service.Profile.lastName}
                            </p>
                            <p className="text-sm">Services by Provider: {service.Profile.numServices}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No services found.</p>
            )}
        </div>
    )
}