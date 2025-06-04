"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { FormattedMessage } from "react-intl"
import Link from "next/link"
import ContactAvatar from "../contact-avatar"
import type { Contact } from "@/types/contact"

interface ContactColumnsProps {
    themeColor: string
    locale: string
}

export const contactColumns = ({ themeColor, locale }: ContactColumnsProps): ColumnDef<Contact>[] => {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
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
            header: () => <FormattedMessage id="contact" defaultMessage="Contact" />,
            cell: ({ row }) => {
                const contact = row.original
                const name = contact.name || "Unnamed Contact"
                const Profile = contact.Profile || {}
                const email = contact.Profile?.links?.find((link) => link.title.toLowerCase() === "email")?.link || ""

                const companyName = typeof Profile.companyName === "string" ? Profile.companyName.trim() : ""
                const position = typeof Profile.position === "string" ? Profile.position.trim() : ""
                const positionCompanyText =
                    position && companyName ? `${position} at ${companyName}` : position || companyName || ""

                return (
                    <Link
                        href={`/${locale}/public-profile/${contact.Profile._id}`}
                        className="flex items-center gap-2 w-full"
                    >
                        <ContactAvatar name={name} profilePicture={Profile.profilePicture ?? ""} color={themeColor} />
                        <div className="min-w-0 overflow-hidden">
                            <div className="font-medium truncate text-sm">{name}</div>
                            {/* Show email on larger screens */}
                            {email && <div className="text-xs text-muted-foreground lowercase hidden sm:block truncate">{email}</div>}
                            {/* Show position at company on small screens */}
                            {positionCompanyText && (
                                <div className="text-xs text-muted-foreground block sm:hidden truncate">{positionCompanyText}</div>
                            )}
                        </div>
                    </Link>
                )
            },
            filterFn: (row, id, value) => {
                const contact = row.original
                const searchValue = value.toLowerCase()
                const name = contact.name?.toLowerCase() || ""
                const email =
                    contact.Profile?.links?.find((link) => link.title.toLowerCase() === "email")?.link?.toLowerCase() || ""
                const Profile = contact.Profile || {}
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
                const contact = row.original
                const Profile = contact.Profile || {}
                const companyName = typeof Profile.companyName === "string" ? Profile.companyName.trim() : ""
                return <div className="truncate text-sm">{companyName || "-"}</div>
            },
        },
        {
            accessorKey: "position",
            header: () => <FormattedMessage id="position" defaultMessage="Position" />,
            cell: ({ row }) => {
                const contact = row.original
                const Profile = contact.Profile || {}
                const position = typeof Profile.position === "string" ? Profile.position.trim() : ""
                return <div className="truncate text-sm">{position || "-"}</div>
            },
        },
    ]
}
