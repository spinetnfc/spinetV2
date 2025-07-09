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
            header: () => <FormattedMessage id="lead-name" defaultMessage="Name" />,
            cell: (ctx) => ctx.row.original.name || "-"
        },
        {
            accessorKey: "status",
            header: () => <FormattedMessage id="lead-status" defaultMessage="Status" />,
            cell: (ctx) => ctx.row.original.status || "-"
        },
        {
            accessorKey: "priority",
            header: () => <FormattedMessage id="lead-priority" defaultMessage="Priority" />,
            cell: (ctx) => ctx.row.original.priority || "-"
        },
        {
            accessorKey: "createdAt",
            header: () => <FormattedMessage id="lead-created" defaultMessage="Created At" />,
            cell: (ctx) => ctx.row.original.createdAt ? new Date(ctx.row.original.createdAt).toLocaleDateString() : "-"
        },
    ]
}
