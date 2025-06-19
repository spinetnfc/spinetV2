"use client"

import type React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Scan, Users, ArrowLeftRight, Phone, SlidersHorizontal, ChevronDown } from "lucide-react"
import { FormattedMessage } from "react-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"

type FilterType = "all" | "scanned" | "manual" | "exchange" | "phone"

interface FilterOption {
    value: FilterType
    icon: React.ReactNode
    labelId: string
}

const filterOptions: FilterOption[] = [
    {
        value: "all",
        icon: null,
        labelId: "all",
    },
    {
        value: "scanned",
        icon: <Scan className="h-4 w-4" />,
        labelId: "scanned",
    },
    {
        value: "manual",
        icon: <Users className="h-4 w-4" />,
        labelId: "manual",
    },
    {
        value: "exchange",
        icon: <ArrowLeftRight className="h-4 w-4" />,
        labelId: "exchange",
    },
    {
        value: "phone",
        icon: <Phone className="h-4 w-4" />,
        labelId: "phone",
    },
]

export function ContactFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const currentFilter = (searchParams.get("filter") as FilterType) || "all"

    const handleFilterChange = (filter: FilterType) => {
        const params = new URLSearchParams(searchParams)

        if (filter === "all") {
            params.delete("filter")
        } else {
            params.set("filter", filter)
        }

        replace(`${pathname}?${params.toString()}`)
    }

    // const currentOption = filterOptions.find((option) => option.value === currentFilter)

    return (
        <div className="w-fit">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center h-10"
                    >
                        <SlidersHorizontal className="h-8 w-8 text-azure" strokeWidth={3} />
                        {/* <span>
                            <FormattedMessage
                                id={currentOption?.labelId || "all"}
                                defaultMessage={currentOption?.value === "all" ? "All" : currentOption?.value}
                            />
                        </span>
                        <ChevronDown className="h-4 w-4" /> */}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {filterOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleFilterChange(option.value)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            {option.icon}
                            <span>
                                <FormattedMessage id={option.labelId} defaultMessage={option.value === "all" ? "All" : option.value} />
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
