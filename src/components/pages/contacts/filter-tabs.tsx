"use client"

import type React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Scan, Users, ArrowLeftRight, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormattedMessage } from "react-intl"

type FilterType = "all" | "scanned" | "manual" | "exchange" | "phone"

interface FilterOption {
    value: FilterType
    icon: React.ReactNode
}

interface FilterTabsProps {
    themeColor: string
}

const filterOptions: FilterOption[] = [
    {
        value: "scanned",
        icon: <Scan className="h-[12px] w-[12px] xs:h-[16px] xs:w-[16px] sm:h-[18px] sm:w-[18px]" />,
    },
    {
        value: "manual",
        icon: <Users className="h-[12px] w-[12px] xs:h-[16px] xs:w-[16px] sm:h-[18px] sm:w-[18px]" />,
    },
    {
        value: "exchange",
        icon: <ArrowLeftRight className="h-[12px] w-[12px] xs:h-[16px] xs:w-[16px] sm:h-[18px] sm:w-[18px]" />,
    },
    {
        value: "phone",
        icon: <Phone className="h-[12px] w-[12px] xs:h-[16px] xs:w-[16px] sm:h-[18px] sm:w-[18px]" />,
    },
]

export default function FilterTabs({ themeColor }: FilterTabsProps) {
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

    return (
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 no-scrollbar">
            {filterOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={cn(
                        "flex items-center gap-0.5 sm:gap-1.5 px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] xs:text-xs sm:text-sm whitespace-nowrap border",
                        currentFilter === option.value ? "border-transparent" : " border-gray-200",
                    )}
                    style={currentFilter === option.value ? { backgroundColor: themeColor } : {}}
                >
                    {option.icon}
                    <span className="truncate max-w-[60px] sm:max-w-none">
                        <FormattedMessage id={option.value} />
                    </span>
                </button>
            ))}
        </div>
    )
}
