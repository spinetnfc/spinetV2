"use client"

import { useState } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import type { ServicesData, ServicesSearchParams } from "@/types/services"
import { SerachServicesAction } from "@/actions/services"

type ServicesCardListProps = {
    services: ServicesData[]
    locale: string
    userId: string | null
}

export function ServicesCardList({ services: initialServices, locale, userId }: ServicesCardListProps) {
    const [services, setServices] = useState(initialServices)
    const [searchTerm, setSearchTerm] = useState("")
    // Moved hooks before any early returns
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Show loading spinner if userId is null
    if (userId === null) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    const handleSearch = async (term: string) => {
        setSearchTerm(term)
        const searchParams: ServicesSearchParams = {
            term,
            skip: 0,
            priority: "score",
            limit: 10,
        }
        // Update URL with new search params
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set("term", term)
        } else {
            params.delete("term")
        }
        replace(`${pathname}?${params.toString()}`)

        const response = await SerachServicesAction(userId, searchParams)
        if (response.success && response.data) {
            setServices(response.data)
        }
    }

    return (
        <div>
            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search services..."
                className="mb-4 w-full rounded-md border p-2"
            />

            {/* Services Cards */}
            {services.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={`${service.Profile._id}-${index}`}
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