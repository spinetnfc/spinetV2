"use client"

import { MoreVertical, Mail, Phone } from "lucide-react"
import ContactAvatar from "./contact-avatar"
import type { ContactInput } from "@/types/contact"

type ContactItemProps = {
    contact: ContactInput
    themeColor: string
}

export default function ContactItem({ contact, themeColor }: ContactItemProps) {
    const name = contact.name
    const Profile = contact.Profile ?? {}

    const position = Profile.position?.trim()
    const companyName = Profile.companyName?.trim()

    const hasPositionOrCompany = Boolean(position || companyName)

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <ContactAvatar
                    name={name}
                    profilePicture={Profile.profilePicture ?? ""}
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
                <button className="p-2">
                    <MoreVertical size={20} className="text-gray-400" />
                </button>
            </div>
        </div>
    )
}
