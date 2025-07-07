"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { FormattedMessage } from "react-intl"
import Link from "next/link"
import type { Lead } from "@/types/leads"

export const leadColumns = (locale: string): ColumnDef<Lead>[] => {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    className="sm:h-5 sm:w-5 border-gray-400 dark:border-gray-600 bg-transparent dark:dark:bg-transparent cursor-pointer"
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className="sm:h-5 sm:w-5 border-gray-400 dark:border-gray-600 bg-transparent dark:dark:bg-transparent cursor-pointer"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: () => <FormattedMessage id="lead" defaultMessage="Lead" />,
            cell: ({ row }) => {
                const lead = row.original
                const name = lead.name || "Unnamed Lead"
                return (
                    <div className="flex items-center gap-2 w-full">
                        <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center text-xs font-bold">
                            {name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 overflow-hidden">
                            <div className="font-medium truncate text-xs xs:text-sm sm:text-base">{name}</div>
                        </div>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                const lead = row.original
                const searchValue = value.toLowerCase()
                const name = lead.name?.toLowerCase() || ""
                const description = lead.description?.toLowerCase() || ""
                return name.includes(searchValue) || description.includes(searchValue)
            },
        },
        {
            accessorKey: "company",
            header: () => <FormattedMessage id="company" defaultMessage="Company" />,
            cell: ({ row }) => {
                const lead = row.original
                const companyName = (lead as any).companyName || "-"
                return <div className="truncate text-xs sm:text-base">{companyName}</div>
            },
        },
        {
            accessorKey: "position",
            header: () => <FormattedMessage id="position" defaultMessage="Position" />,
            cell: ({ row }) => {
                const lead = row.original
                const position = (lead as any).position || "-"
                return <div className="truncate text-sm sm:text-base">{position}</div>
            },
        },
    ]
}
