import Image from "next/image"
import { Linkedin, Globe, Phone, UserPlus, Send, Facebook, Instagram, Youtube, Mail, Twitter } from "lucide-react"
import Link from "next/link"
import PlayStoreIcon from "@/components/icons/play-store"
import AppStoreIcon from "@/components/icons/app-store"

export default function ProfilePage() {
    // Links array that will be fetched dynamically later
    const links = [
        {
            href: "#",
            label: "Linkedin",
            iconType: "linkedin",
        },
        {
            href: "#",
            label: "Website",
            iconType: "globe",
        },
        {
            href: "tel:+2130556565198",
            label: "+2130556565198",
            iconType: "phone",
        },
        {
            href: "tel:+2130556565198",
            label: "+2130556565198",
            iconType: "phone",
        },
    ]

    // Function to render the appropriate icon based on iconType
    const renderIcon = (iconType: string) => {
        switch (iconType) {
            case "linkedin":
                return <Linkedin className="w-5 h-5 text-azure" />
            case "facebook":
                return <Facebook className="w-5 h-5 text-azure" />
            case "instagram":
                return <Instagram className="w-5 h-5 text-azure" />
            case "youtube":
                return <Youtube className="w-5 h-5 text-azure" />
            case "twitter":
                return <Twitter className="w-5 h-5 text-azure" />
            case "mail":
                return <Mail className="w-5 h-5 text-azure" />
            case "phone":
                return <Phone className="w-5 h-5 text-azure" />
            case "globe":
            default:
                return <Globe className="w-5 h-5 text-azure" />
        }
    }

    return (
        <>
            {/* Profile Image */}
            <div className="relative w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 mx-auto -top-16 xs:-top-20 sm:-top-24 bg-neutral-50 rounded-full">
                <Image
                    src="/img/user.png"
                    alt="Profile picture "
                    fill
                    className="rounded-full object-cover border-4 border-neutral-50"
                />
                <div className="absolute -bottom-2 left-13 xs:left-16 sm:left-20 bg-neutral-50 border border-gray-300 h-7 xs:h-8 w-7 xs:w-8 p-[1px] flex items-center justify-center rounded-md">
                    <Image
                        src="/img/spinet-logo.svg"
                        alt="company logo"
                        width={24}
                        height={24}
                        className="rounded-full bg-white"
                    />
                </div>
            </div>
            <div className="sm:container mx-auto px-4 -mt-10 sm:-mt-16 mb-8">
                <div className="max-w-md mx-auto sm:bg-neutral-50 sm:dark:bg-navy rounded-3xl sm:shadow-xl overflow-hidden">
                    <div className="flex flex-col items-center sm:pt-8 pb-6">
                        {/* Name and Title */}
                        <h1 className="text-xl font-bold">Abdellah Bouras</h1>
                        <p className="text-sm text-gray-500">dev at SPINET</p>

                        {/* Contact Buttons */}
                        <div className="w-full px-6 mt-6 space-y-3">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="flex items-center w-full p-3 bg-blue-50 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    {renderIcon(link.iconType)}
                                    <span className="ml-3 font-medium text-gray-700">{link.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full px-6 mt-6 grid grid-cols-2 gap-3">
                            <button className="border-2 border-azure hover:opacity-80 text-azure text-lg font-medium w-fit xs:w-full mx-auto flex items-center justify-center gap-1 px-2 xs:px-0 py-2 rounded-xl xs:rounded-md cursor-pointer">
                                <UserPlus className="h-8 w-8 xs:h-5 xs:w-5" />
                                <span className="hidden xs:inline-block text-sm sm:text-base whitespace-nowrap">Ajouter contact</span>
                            </button>
                            <button className="bg-azure hover:bg-azure/70 text-white text-lg font-medium w-fit xs:w-full mx-auto flex items-center justify-center gap-1 px-2 xs:px-0 py-2 rounded-xl xs:rounded-md cursor-pointer">
                                <Send className="h-8 w-8 xs:h-5 xs:w-5" />
                                <span className="hidden xs:inline-block text-sm sm:text-base whitespace-nowrap">Envoyer message</span>
                            </button>
                        </div>

                        <div className="flex-col justify-center items-center mt-6">
                            <h2 className="text-center text-2xl font-semibold">Download App</h2>
                            <div className="flex flex-col xs:flex-row gap-2 xs:gap-10 mt-4">
                                <Link
                                    href="https://play.google.com/store/apps/details?id=com.spinet.spinetnfc&hl=en"
                                    className="flex items-center gap-1 text-azure font-medium"
                                >
                                    <PlayStoreIcon className="w-8 h-8" />
                                    From Play Store
                                </Link>
                                <Link
                                    href="https://apps.apple.com/fr/app/spinet-nfc/id1606369890"
                                    className="flex items-center gap-1 text-azure font-medium"
                                >
                                    <AppStoreIcon className="w-8 h-8" />
                                    From App Store
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Padding */}
                        <div className="h-6" />
                    </div>
                </div>
            </div>
        </>
    )
}

