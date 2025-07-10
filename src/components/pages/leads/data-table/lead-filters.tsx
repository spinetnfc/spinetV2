"use client"

import type React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { FormattedMessage } from "react-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const statusOptions = [
    { value: "all", labelId: "all" },
    { value: "pending", labelId: "pending" },
    { value: "prospecting", labelId: "prospecting" },
    { value: "offer-sent", labelId: "offer-sent" },
    { value: "negotiation", labelId: "negotiation" },
    { value: "administrative-validation", labelId: "administrative-validation" },
    { value: "done", labelId: "done" },
    { value: "failed", labelId: "failed" },
    { value: "canceled", labelId: "canceled" },
]

export function LeadStatusFilter() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Get all status params as an array
    const currentStatuses = searchParams.getAll("status")

    const handleStatusToggle = (status: string) => {
        const params = new URLSearchParams(searchParams)
        let newStatuses = [...currentStatuses]
        if (status === "all") {
            // Clear all statuses
            statusOptions.forEach(opt => {
                if (opt.value !== "all") params.delete("status")
            })
            replace(`${pathname}?${params.toString()}`)
            return
        }
        if (newStatuses.includes(status)) {
            newStatuses = newStatuses.filter(s => s !== status)
        } else {
            newStatuses.push(status)
        }
        // Remove all status params
        params.delete("status")
        // Add back selected
        newStatuses.forEach(s => params.append("status", s))
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="w-fit">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <SlidersHorizontal className="h-8 w-8 text-gray-400 dark:text-azure" strokeWidth={3} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        key="all"
                        onSelect={e => { e.preventDefault(); handleStatusToggle("all"); }}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Checkbox checked={currentStatuses.length === 0} className="mr-2" />
                        <span>
                            <FormattedMessage id="all" defaultMessage="All" />
                        </span>
                    </DropdownMenuItem>
                    {statusOptions.filter(opt => opt.value !== "all").map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onSelect={e => { e.preventDefault(); handleStatusToggle(option.value); }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox checked={currentStatuses.includes(option.value)} className="mr-2" />
                            <span>
                                <FormattedMessage id={option.labelId} defaultMessage={option.value} />
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
