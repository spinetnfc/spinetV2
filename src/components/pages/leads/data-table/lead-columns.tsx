"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { FormattedMessage } from "react-intl"
import Link from "next/link"
import ContactAvatar from "../lead-avatar"
import type { Contact } from "@/types/lead"

export const leadColumns = (locale: string): ColumnDef<Contact>[] => {
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
            header: () => <FormattedMessage id="lead" defaultMessage="Contact" />,
            cell: ({ row }) => {
                const lead = row.original
                const name = lead.Profile.fullName || "Unnamed Contact"
                const Profile = lead.Profile || {}
                const email = lead.Profile?.links?.find((link) => link.title.toLowerCase() === "email")?.link || ""

                const companyName = typeof Profile.companyName === "string" ? Profile.companyName.trim() : ""
                const position = typeof Profile.position === "string" ? Profile.position.trim() : ""
                const positionCompanyText =
                    position && companyName ? `${position} at ${companyName}` : position || companyName || ""

                return (
                    <div
                        // href={`/${locale}/public-profile/${lead.Profile._id}`}
                        className="flex items-center gap-2 w-full"
                    >
                        <ContactAvatar name={name} profilePicture={Profile.profilePicture ?? ""} />
                        <div className="min-w-0 overflow-hidden">
                            <div className="font-medium truncate text-xs xs:text-sm sm:text-base">{name}</div>
                            {/* show email on larger screens */}
                            {email && <div className="text-xs text-muted-foreground lowercase hidden sm:block truncate">{email}</div>}
                            {/* show position at company on small screens */}
                            {positionCompanyText && (
                                <div className="text-xs text-muted-foreground block sm:hidden truncate">{positionCompanyText}</div>
                            )}
                        </div>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                const lead = row.original
                const searchValue = value.toLowerCase()
                const name = lead.Profile.fullName?.toLowerCase() || ""
                const email =
                    lead.Profile?.links?.find((link) => link.title.toLowerCase() === "email")?.link?.toLowerCase() || ""
                const Profile = lead.Profile || {}
                const companyName = typeof Profile.companyName === "string" ? Profile.companyName.toLowerCase() : ""
                const position = typeof Profile.position === "string" ? Profile.position.toLowerCase() : ""

                return (
                    name.includes(searchValue) ||
                    email.includes(searchValue) ||
                    companyName.includes(searchValue) ||
                    position.includes(searchValue)
                )
            },
        },
        {
            accessorKey: "company",
            header: () => <FormattedMessage id="company" defaultMessage="Company" />,
            cell: ({ row }) => {
                const lead = row.original
                const Profile = lead.Profile || {}
                const companyName = typeof Profile.companyName === "string" ? Profile.companyName.trim() : ""
                return <div className="truncate text-xs sm:text-base">{companyName || "-"}</div>
            },
        },
        {
            accessorKey: "position",
            header: () => <FormattedMessage id="position" defaultMessage="Position" />,
            cell: ({ row }) => {
                const lead = row.original
                const Profile = lead.Profile || {}
                const position = typeof Profile.position === "string" ? Profile.position.trim() : ""
                return <div className="truncate text-sm sm:text-base">{position || "-"}</div>
            },
        },
    ]
}
