"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { FormattedMessage } from "react-intl"
import type { Lead } from "@/types/leads"

export const leadColumns = (locale: string, isMobile = false): ColumnDef<Lead>[] => {
  const baseColumns: ColumnDef<Lead>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="sm:h-5 sm:w-5 border-gray-400 dark:border-gray-600 bg-transparent cursor-pointer"
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="sm:h-5 sm:w-5 border-gray-400 dark:border-gray-600 bg-transparent cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "name",
      header: () => <FormattedMessage id="name" defaultMessage="Name" />,
      cell: (ctx) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{ctx.row.original.name || "-"}</div>
          {isMobile && ctx.row.original.description && (
            <div className="text-sm text-gray-500 truncate">{ctx.row.original.description}</div>
          )}
        </div>
      ),
      minSize: 150,
    },
    {
      accessorKey: "status",
      header: () => <FormattedMessage id="status" defaultMessage="Status" />,
      cell: (ctx) =>
        ctx.row.original.status ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FormattedMessage id={ctx.row.original.status} defaultMessage={ctx.row.original.status} />
          </span>
        ) : (
          "-"
        ),
      size: 120,
    },
    {
      accessorKey: "priority",
      header: () => <FormattedMessage id="priority" defaultMessage="Priority" />,
      cell: (ctx) => {
        const priority = ctx.row.original.priority
        if (!priority || priority === "none") return "-"

        const priorityColors = {
          low: "bg-green-100 text-green-800",
          medium: "bg-yellow-100 text-yellow-800",
          high: "bg-orange-100 text-orange-800",
          critical: "bg-red-100 text-red-800",
        }

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority as keyof typeof priorityColors] || "bg-gray-100 text-gray-800"}`}
          >
            <FormattedMessage id={priority} defaultMessage={priority} />
          </span>
        )
      },
      size: 100,
    },
  ]

  if (!isMobile) {
    baseColumns.push({
      accessorKey: "mainContact",
      header: () => <FormattedMessage id="main-contact" defaultMessage="Main Contact" />,
      cell: (ctx) => {
        const mc = ctx.row.original.mainContact
        if (!mc) return "-"

        if (typeof mc === "string") return <span className="truncate">{mc}</span>
        if (typeof mc === "object" && (mc.fullName || mc.name)) {
          return <span className="truncate">{mc.fullName || mc.name}</span>
        }
        return "-"
      },
      size: 180,
    })
  }

  return baseColumns
}
