"use client"

import React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { FormattedMessage } from "react-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

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

export function LeadFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [datePopoverOpen, setDatePopoverOpen] = React.useState(false)
    const [dateRange, setDateRange] = React.useState<{ start: Date | null, end: Date | null }>({ start: null, end: null })
    const [searchValue, setSearchValue] = React.useState(searchParams.get("search") || "")
    const currentStatuses = searchParams.getAll("status")

    // Search logic
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
        const params = new URLSearchParams(searchParams.toString())
        if (event.target.value) {
            params.set("search", event.target.value)
        } else {
            params.delete("search")
        }
        params.set("page", "1")
        replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    // Status logic
    const handleStatusToggle = (status: string) => {
        const params = new URLSearchParams(searchParams)
        let newStatuses = [...currentStatuses]
        if (status === "all") {
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
        params.delete("status")
        newStatuses.forEach(s => params.append("status", s))
        replace(`${pathname}?${params.toString()}`)
    }

    // Date range logic
    const handleDateChange = (type: "start" | "end", date: Date | undefined) => {
        const newRange = { ...dateRange, [type]: date || null }
        setDateRange(newRange)
        const params = new URLSearchParams(searchParams.toString())
        if (newRange.start || newRange.end) {
            const begins = { start: newRange.start ? newRange.start.toISOString().slice(0, 10) : "", end: "" }
            const ends = { start: "", end: newRange.end ? newRange.end.toISOString().slice(0, 10) : "" }
            params.set("lifeTime", JSON.stringify({ begins, ends }))
        } else {
            params.delete("lifeTime")
        }
        params.set("page", "1")
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center border-1 border-gray-300 dark:border-azure w-fit rounded-lg">
            <input
                type="text"
                placeholder="Search leads..."
                value={searchValue}
                onChange={handleSearchChange}
                className="max-w-sm border-none h-10 min-w-60 sm:min-w-80 px-2 py-1 rounded text-sm"
            />
            <div className="flex">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <SlidersHorizontal className="h-8 w-8 text-gray-400 dark:text-azure" strokeWidth={3} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <CalendarIcon className="h-6 w-6 text-gray-400 dark:text-azure" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="flex flex-col gap-2 w-auto p-4">
                        <div className="flex max-sm:flex-col gap-2 items-center">
                            <div>
                                <span className="block text-xs mb-1"><FormattedMessage id="start-date" /></span>
                                <Calendar
                                    mode="single"
                                    selected={dateRange.start || undefined}
                                    onSelect={(date) => handleDateChange("start", date)}
                                />
                            </div>
                            <div>
                                <span className="block text-xs mb-1"><FormattedMessage id="end-date" /></span>
                                <Calendar
                                    mode="single"
                                    selected={dateRange.end || undefined}
                                    onSelect={(date) => handleDateChange("end", date)}
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
