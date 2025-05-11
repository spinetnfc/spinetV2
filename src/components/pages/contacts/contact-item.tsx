"use client"

import { MoreVertical, Mail, Phone } from "lucide-react"
import ContactAvatar from "./contact-avatar"
import type { Contact } from "@/types/contact"

type ContactItemProps = {
    contact: Contact
    themeColor: string
}

export default function ContactItem({ contact, themeColor }: ContactItemProps) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <ContactAvatar
                    name={contact.name}
                    profilePicture={contact.profile.profilePicture}
                    color={themeColor}
                />
                <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    {(contact.profile.position || contact.profile.compantName) && (
                        <p className="text-sm text-gray-500">
                            {contact.profile.position}
                            {contact.profile.position && contact.profile.compantName && " "}
                            {contact.profile.compantName}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* You can conditionally show icons if email/phone fields are added to the type */}
                {/* Example usage if those fields are added back: */}
                {/* {contact.profile.email && (...) */}
                {/* {contact.profile.phone && (...) */}
                <button className="p-2">
                    <MoreVertical size={20} className="text-gray-400" />
                </button>
            </div>
        </div>
    )
}
