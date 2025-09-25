"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { ServicesData, ServicesSearchParams } from "@/types/services"
import { Input } from "@/components/ui/input"
import { Briefcase, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormattedMessage, useIntl } from "react-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import avatar from "@/assets/images/user.png"
import Image from "next/image"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { ProfileAvatar } from "../profile/profile-avatar"

type ServicesCardListProps = {
    services: ServicesData[]
    locale: string
    userId: string | null
    searchParams: ServicesSearchParams
}

export function ServicesCardList({ services: initialServices, locale, userId, searchParams: initialSearchParams }: ServicesCardListProps) {
    const [services, setServices] = useState(initialServices)
    const [searchTerm, setSearchTerm] = useState(initialSearchParams.term || "")
    const [showDetails, setShowDetails] = useState<ServicesData | null>(null)
    const [skip, setSkip] = useState(initialServices.length)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const urlSearchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const intl = useIntl()
    const observerRef = useRef<HTMLDivElement | null>(null)

    // Show loading spinner if userId is null
    if (userId === null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="text-white" size="xxl" />
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
            replace(`${pathname}?${newParamsString}`, { scroll: false })
        }

        // Fetch new services
        const searchParams: ServicesSearchParams = {
            ...initialSearchParams,
            term: searchTerm,
            skip: 0, // Reset skip on new search
        }
        setIsLoading(true)
        // Mock search services - replace with hardcoded behavior
        const mockServices = [
            {
                name: "Web Development",
                description: "Professional web development services",
                Profile: {
                    _id: "profile-1",
                    firstName: "John",
                    lastName: "Doe",
                    profilePicture: "",
                    numServices: 3
                }
            }
        ];
        setServices(mockServices)
        setSkip(mockServices.length)
        setHasMore(false)
        setIsLoading(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    // Fetch more services when reaching the end
    const loadMoreServices = async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        const searchParams: ServicesSearchParams = {
            ...initialSearchParams,
            term: searchTerm,
            skip,
        }
        // Mock load more services - replace with hardcoded behavior
        console.log("Mock load more services:", searchParams);
        setIsLoading(false)
        // No more services to load in mock
        setHasMore(false)
    }

    // Intersection Observer to detect end of list
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreServices()
                }
            },
            { threshold: 0.1 }
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current)
            }
        }
    }, [hasMore, isLoading, skip, initialSearchParams, userId])

    useEffect(() => {
        if (searchTerm === "") {
            handleSearch()
        }
    }, [searchTerm])


    return (
        <div className="space-y-8 pb-4">
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

            {/* Service Details */}
            {showDetails && (

                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="bg-blue-200 dark:bg-navy p-4 border-slate-300 dark:border-slate-700 hover:bg-slate-750 group relative transition-colors">
                        <CardContent className="h-full min-w-80 p-0 flex flex-col justify-between cursor-pointer">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                                onClick={() => setShowDetails(null)}
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold text-primary mb-4">{showDetails.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{showDetails.description}</p>
                            <div className="flex items-center justify-between">
                                <Link href={`/${locale}/public-profile/${showDetails.Profile._id}`} className="flex items-center gap-2">
                                    <div className="bg-white rounded-full">
                                        <ProfileAvatar
                                            profilePicture={showDetails.Profile.profilePicture}
                                            alt={`${showDetails.Profile.firstName} ${showDetails.Profile.lastName}`}
                                        />

                                    </div>
                                    <span className="text-sm font-semibold text-gray-400">
                                        {showDetails.Profile.firstName} {showDetails.Profile.lastName}
                                    </span>
                                </Link>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                    {showDetails.Profile.numServices}{" "}
                                    {showDetails.Profile.numServices === 1 ? (
                                        <FormattedMessage id="service" />
                                    ) : (
                                        <FormattedMessage id="services" />
                                    )}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
            }

            {/* Services Cards */}
            {
                services.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <Card
                                key={`${service.Profile._id}-${index}`}
                                className="bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700 hover:bg-slate-750 group relative transition-colors"
                            >
                                <CardContent className="h-full p-4 flex flex-col justify-between cursor-pointer" onClick={() => setShowDetails(service)}>
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-primary mb-1">{service.name}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{service.description}</p>
                                        </div>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation() }} className="flex items-center justify-between">
                                        <Link href={`/${locale}/public-profile/${service.Profile._id}`} className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg p-1">
                                            <div className="bg-white rounded-full">
                                                <ProfileAvatar
                                                    profilePicture={service.Profile.profilePicture}
                                                    alt={`${service.Profile.firstName} ${service.Profile.lastName}`}
                                                />

                                            </div>
                                            <span className="text-sm font-semibold text-gray-400">
                                                {service.Profile.firstName} {service.Profile.lastName}
                                            </span>
                                        </Link>
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                            {service.Profile.numServices}{" "}
                                            {service.Profile.numServices === 1 ? (
                                                <FormattedMessage id="service" />
                                            ) : (
                                                <FormattedMessage id="services" />
                                            )}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-4xl font-bold text-center text-primary">
                        <FormattedMessage id="No-services-found" defaultMessage="No services found" /> !
                    </p>
                )
            }

            {/* Loading Spinner or No More Services */}
            {
                isLoading && (
                    <div className="flex justify-center items-center h-16">
                        <Spinner className="text-white" size="lg" />
                    </div>
                )
            }
            {
                !hasMore && services.length > 0 && (
                    <p className="text-center text-gray-500">
                        <FormattedMessage id="no-more-services" defaultMessage="No more services" />
                    </p>
                )
            }

            {/* Intersection Observer Target */}
            <div ref={observerRef} className="h-1"></div>
        </div >
    )
}