"use client"

import { MoreVertical, Mail, Phone } from "lucide-react"
import ContactAvatar from "./contact-avatar"
import type { Contact } from "@/types/contact"

type ContactItemProps = {
    contact: Contact
    themeColor: string
}

export default function ContactItem({ contact, themeColor }: ContactItemProps) {
    const name = contact.name ?? "Unnamed Contact"
    const profile = contact.profile ?? {}

    const position = profile.position?.trim()
    const companyName = profile.companyName?.trim()

    const hasPositionOrCompany = Boolean(position || companyName)

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <ContactAvatar
                    name={name}
                    profilePicture={profile.profilePicture ?? ""}
                    color={themeColor}
                />
                <div>
                    <h3 className="font-medium">{name}</h3>
                    {hasPositionOrCompany && (
                        <p className="text-sm text-gray-500">
                            {position}
                            {position && companyName && " "}
                            {companyName}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Optional email/phone rendering */}
                {/* {profile.email && (
                    <a href={`mailto:${profile.email}`} className="p-2 text-gray-400">
                        <Mail size={20} />
                    </a>
                )}
                {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="p-2 text-gray-400">
                        <Phone size={20} />
                    </a>
                )} */}
                <button className="p-2">
                    <MoreVertical size={20} className="text-gray-400" />
                </button>
            </div>
        </div>
    )
}
