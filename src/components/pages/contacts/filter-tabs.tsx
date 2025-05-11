"use client"

import type React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Scan, Users, ArrowLeftRight, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterType = "all" | "scanned" | "manual" | "exchange" | "phone"

interface FilterOption {
    value: FilterType
    label: string
    icon: React.ReactNode
}

interface FilterTabsProps {
    themeColor: string
}

const filterOptions: FilterOption[] = [
    {
        value: "scanned",
        label: "Scanned",
        icon: <Scan size={18} />,
    },
    {
        value: "manual",
        label: "Manual",
        icon: <Users size={18} />,
    },
    {
        value: "exchange",
        label: "Exchange",
        icon: <ArrowLeftRight size={18} />,
    },
    {
        value: "phone",
        label: "Phone contact",
        icon: <Phone size={18} />,
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
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {filterOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm whitespace-nowrap border",
                        currentFilter === option.value ? "text-white border-transparent" : "bg-white text-gray-700 border-gray-200",
                    )}
                    style={currentFilter === option.value ? { backgroundColor: themeColor } : {}}
                >
                    {option.icon}
                    {option.label}
                </button>
            ))}
        </div>
    )
}
