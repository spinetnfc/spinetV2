import Image from "next/image"
import {
    Linkedin,
    Globe,
    Phone,
    Facebook,
    Instagram,
    Youtube,
    Mail,
    Twitter,
    Store,
    MapPinned,
    UserPlus,
    Send,
    Github,
} from "lucide-react"
import Link from "next/link"
import PlayStoreIcon from "@/components/icons/play-store"
import AppStoreIcon from "@/components/icons/app-store"
import Whatsapp from "@/components/icons/whatsapp"
import Telegram from "@/components/icons/telegram"
import Viber from "@/components/icons/viber"
import Tiktok from "@/components/icons/tiktok"
import { EmailLink } from "@/components/pages/profile/email-link-wrapper"
import useTranslate from '@/hooks/use-translate';

export default async function ProfilePage({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);

    const links = [
        {
            href: "mailto:contact@spinetnfc.com", // Default fallback for SSR
            label: "Email",
            iconType: "email",
            email: "contact@spinetnfc.com",
            isEmail: true,
        },
        {
            href: "https://www.instagram.com/spinet.nfc/",
            label: "Instagram",
            iconType: "instagram",
        },
        {
            href: "https://play.google.com/store/apps/details?id=com.spinet.spinetnfc",
            label: "Play Store",
            iconType: "playStore",
        },
        {
            href: "https://apps.apple.com/app/spinet-nfc/id1606369890",
            label: "App Store",
            iconType: "appStore",
        },
        {
            href: "https://spinet-nfc.youcan.store/",
            label: "Order now",
            iconType: "store",
        },
        {
            href: "https://www.linkedin.com/company/sarl-spinet-nfc/",
            label: "LinkedIn",
            iconType: "linkedin",
        },
        {
            href: "https://www.google.com/maps/place/Itihad.group,+15+Rue+Zareb+MEDJADJ,+martitimes/data=!4m2!3m1!1s0x128e534c5e1df32d:0x8e6b7c61def6e281?entry=gps&lucs=karto&g_ep=CAESCTExLjYwLjcwMxgAIIgnKgVrYXJ0b0ICRFo%3D",
            label: "location",
            iconType: "location",
        },
        {
            href: "https://spinetnfc.com/",
            label: "Website",
            iconType: "globe",
        },
        {
            href: "https://www.facebook.com/spinetnfc/",
            label: "Facebook",
            iconType: "facebook",
        },
        {
            href: "tel:+2130556565198",
            label: "Phone",
            iconType: "phone",
            phoneNumber: "+2130556565198",
        },
        {
            href: "https://wa.me/2130556565198",
            label: "WhatsApp",
            iconType: "whatsapp",
            phoneNumber: "+2130556565198",
        },
        {
            href: "https://t.me/+2130556565198",
            label: "Telegram",
            iconType: "telegram",
            phoneNumber: "+2130556565198",
        },
        {
            href: "viber://chat?number=+2130556565198",
            label: "Viber",
            iconType: "viber",
            phoneNumber: "+2130556565198",
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
            case "email":
                return <Mail className="w-5 h-5 text-azure" />
            case "phone":
                return <Phone className="w-5 h-5 text-azure" />
            case "github":
                return <Github className="w-5 h-5 text-azure" />
            case "playStore":
                return <PlayStoreIcon className="w-5 h-5 text-azure" />
            case "appStore":
                return <AppStoreIcon className="w-5 h-5 text-azure" />
            case "store":
                return <Store className="w-5 h-5 text-azure" />
            case "location":
                return <MapPinned className="w-5 h-5 text-azure" />
            case "whatsapp":
                return <Whatsapp className="w-6 h-6 text-azure" />
            case "telegram":
                return <Telegram className="w-6 h-6 text-azure" />
            case "viber":
                return <Viber className="w-6 h-6 text-azure" />
            case "tiktok":
                return <Tiktok className="w-6 h-6 text-azure" />
            case "globe":
            default:
                return <Globe className="w-5 h-5 text-azure" />
        }
    }

    // Check if the link is a phone or messaging app type
    const isNumberOrEmail = (iconType: string) => {
        return ["phone", "whatsapp", "telegram", "viber", "email"].includes(iconType)
    }

    // Render a single link
    const renderLink = (link: any, index: number) => {
        if (link.isEmail && link.email) {
            return (
                <EmailLink
                    key={index}
                    email={link.email}
                    label={link.label}
                    icon={renderIcon(link.iconType)}
                />
            )
        }

        return (
            <Link
                key={index}
                href={link.href}
                target="_blank"
                className="flex items-center w-full h-12 px-3 bg-blue-200 rounded-md hover:bg-gray-200 transition-colors"
            >
                {renderIcon(link.iconType)}
                <div className="ms-3 overflow-hidden">
                    <span className="font-medium text-gray-700 truncate block">{link.label}</span>
                    {isNumberOrEmail(link.iconType) && (link.phoneNumber || link.email) && (
                        <p className="text-[10px] font-semibold text-gray-500 -mt-1 truncate">{link.phoneNumber || link.email}</p>
                    )}
                </div>
            </Link>
        )
    }

    return (
        <>
            {/* Mobile Layout (default) */}
            <div className="sm:hidden">
                {/* Profile Image */}
                <div className="relative w-32 h-32 xs:w-40 xs:h-40 mx-auto -top-16 xs:-top-20 bg-neutral-50 rounded-full">
                    <Image
                        src="/img/user.png"
                        alt="Profile picture"
                        fill
                        className="rounded-full object-cover border-4 border-neutral-50"
                    />
                    <div className="absolute -bottom-2 start-13 xs:start-16 bg-neutral-50 border border-gray-300 h-7 xs:h-8 w-7 xs:w-8 p-[1px] flex items-center justify-center rounded-md">
                        <Image
                            src="/img/spinet-logo.svg"
                            alt="company logo"
                            width={24}
                            height={24}
                            className="rounded-full bg-white"
                        />
                    </div>
                </div>
                <div className="sm:container mx-auto px-4 -mt-10 mb-8">
                    <div className="max-w-md mx-auto sm:border sm:bg-gray-100 sm:dark:bg-navy rounded-3xl sm:shadow-xl overflow-hidden">
                        <div className="flex flex-col items-center sm:pt-8 pb-6">
                            {/* Name and Title */}
                            <h1 className="text-xl font-bold">Spinet NFC</h1>
                            <p className="text-sm text-gray-500">Company at SPINET</p>

                            {/* Contact Buttons */}
                            <div className="w-full px-6 mt-6 space-y-3">{links.map((link, index) => renderLink(link, index))}</div>

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
                                        <span className="truncate">From Play Store</span>
                                    </Link>
                                    <Link
                                        href="https://apps.apple.com/fr/app/spinet-nfc/id1606369890"
                                        className="flex items-center gap-1 text-azure font-medium"
                                    >
                                        <AppStoreIcon className="w-8 h-8" />
                                        <span className="truncate">From App Store</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Bottom Padding */}
                            <div className="h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block max-w-4xl mx-auto px-4 mb-8">
                {/* Banner and Profile Card */}
                <div className="bg-gray-200 dark:bg-navy rounded-3xl shadow-xl overflow-hidden mt-8">
                    {/* Banner */}
                    <div className="relative h-48 bg-[url('/img/spinet-banner.jpg')] bg-cover bg-center">
                        {/* Profile Image */}
                        <div className="absolute start-8 bottom-0 transform translate-y-1/2 w-32 h-32 bg-white rounded-full border-4 border-white">
                            <Image priority src="/img/user.png" alt="Profile picture" fill className="rounded-full object-cover" />
                            <div className="absolute -bottom-2 right-0 bg-white border border-gray-300 h-8 w-8 p-[1px] flex items-center justify-center rounded-md">
                                <Image
                                    src="/img/spinet-logo.svg"
                                    alt="company logo"
                                    width={24}
                                    height={24}
                                    className="rounded-full bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-20 px-8 pb-8">
                        {/* Name and Title */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Spinet NFC</h1>
                            <p className="text-gray-500">Company at SPINET</p>
                        </div>

                        {/* Links Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">{links.map((link, index) => renderLink(link, index))}</div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button className="border-2 border-azure hover:opacity-80 text-azure font-medium flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer">
                                <UserPlus className="h-5 w-5" />
                                <span>{t("add-contact")}</span>
                            </button>
                            <button className="bg-azure hover:bg-azure/70 text-white font-medium flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer">
                                <Send className="h-5 w-5" />
                                <span>{t("send-message")}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Download App Section (Outside Card) */}
                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Download App</h2>
                    <div className="flex justify-center gap-10">
                        <Link
                            href="https://play.google.com/store/apps/details?id=com.spinet.spinetnfc&hl=en"
                            className="flex items-center gap-2 text-azure font-medium"
                        >
                            <PlayStoreIcon className="w-8 h-8" />
                            From Play Store
                        </Link>
                        <Link
                            href="https://apps.apple.com/fr/app/spinet-nfc/id1606369890"
                            className="flex items-center gap-2 text-azure font-medium"
                        >
                            <AppStoreIcon className="w-8 h-8" />
                            From App Store
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

