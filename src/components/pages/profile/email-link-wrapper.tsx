"use client"

import { type ReactNode, useEffect, useState } from "react"

interface EmailLinkProps {
    email: string
    label: string
    icon: ReactNode
    phoneNumber?: string
}

export function EmailLink({ email, label, icon, phoneNumber }: EmailLinkProps) {
    const [emailLink, setEmailLink] = useState(`mailto:${email}`)

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent
        const isMobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))

        if (isMobile) {
            setEmailLink(`mailto:${email}`)
        } else {
            setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`)
        }
    }, [email])

    return (
        <a
            href={emailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center w-full h-12 px-3 bg-blue-200 rounded-md hover:bg-gray-200 transition-colors"
        >
            {icon}
            <div className="ms-3 overflow-hidden">
                <span className="font-medium text-gray-700 truncate block">{label}</span>
                <p className="text-[10px] font-semibold text-gray-500 -mt-1 truncate">{phoneNumber || email}</p>
            </div>
        </a>
    )
}

