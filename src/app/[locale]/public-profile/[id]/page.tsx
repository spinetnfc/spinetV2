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
import useTranslate from "@/hooks/use-translate"
import type { ProfileData } from "@/types/profile"
import { getProfile } from "@/lib/api/profile"
import { getUserCookieOnServer } from "@/utils/server-cookie"
import AddContactButton from "@/components/pages/contacts/add-contact-button"

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params
    const user = await getUserCookieOnServer()
    const { t } = await useTranslate(locale)
    let profileData: ProfileData | null
    try {
        // console.log(" fetching profile of id ::::", id, "for user::::", user?._id)
        profileData = await getProfile(id)
        console.log("profileData", profileData)
    } catch (err: any) {
        console.error("Error fetching profile:", err)
        throw new Error(`Failed to load profile data: ${(err.message)}`)
    }

    if (!profileData) {
        throw new Error("Profile data not found")
    }

    const fullName = profileData.fullName ? profileData.fullName : `${profileData.firstName} ${profileData.lastName}`
    const position = profileData?.position
    const company = profileData?.companyName
    const themeColor = profileData?.theme?.color || "azure" // Default to azure if undefined
    console.log(`https://files.spinetnfc.com/files/${profileData.profilePicture}`)
    // Replace the hardcoded links array with dynamic links from profileData
    const links = profileData.links.map((link) => {
        const iconType = link.name.toLowerCase()
        const isEmail = iconType === "email"
        const isPhone = ["phone", "whatsapp", "telegram", "viber"].includes(iconType)

        return {
            href: link.link,
            label: link.title,
            iconType: iconType,
            email: isEmail ? link.link : undefined,
            isEmail: isEmail,
            phoneNumber: isPhone ? link.link : undefined,
        }
    })

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
            case "playstore":
                return <PlayStoreIcon className="w-5 h-5 text-azure" />
            case "appstore":
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
            return <EmailLink key={index} email={link.email} label={link.label} icon={renderIcon(link.iconType)} />
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
                {/* Banner - Moved from layout */}
                <div className="w-full h-60 bg-[url('/img/spinet-banner.jpg')] bg-cover bg-center dark:bg-neutral-100"></div>

                {/* Profile Image */}
                <div className="relative w-32 h-32 xs:w-40 xs:h-40 mx-auto -mt-16 xs:-mt-20 bg-neutral-50 rounded-full">
                    <Image
                        src={profileData.profilePicture ? `https://files.spinetnfc.com/files/${profileData.profilePicture}` : "/img/user.png"}
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
                            <h1 className="text-xl font-bold">{fullName}</h1>
                            <p className="text-sm text-gray-500">
                                {position} {company && t("at")} {company}
                            </p>

                            {/* Contact Buttons */}
                            <div className="w-full px-6 mt-6 space-y-3">
                                {links.length > 0 ? (
                                    links.map((link, index) => renderLink(link, index))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">{t("no-links")}</div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full px-6 mt-6 grid grid-cols-2 gap-3">
                                <button className="border-2 border-azure hover:opacity-80 text-azure text-lg font-medium w-fit xs:w-full mx-auto flex items-center justify-center gap-1 px-2 xs:px-0 py-2 rounded-xl xs:rounded-md cursor-pointer">
                                    <UserPlus className="h-8 w-8 xs:h-5 xs:w-5" />
                                    <span className="hidden xs:inline-block text-sm sm:text-base whitespace-nowrap">
                                        {t("add-contact")}
                                    </span>
                                </button>
                                <button className="bg-azure hover:bg-azure/70 text-white text-lg font-medium w-fit xs:w-full mx-auto flex items-center justify-center gap-1 px-2 xs:px-0 py-2 rounded-xl xs:rounded-md cursor-pointer">
                                    <Send className="h-8 w-8 xs:h-5 xs:w-5" />
                                    <span className="hidden xs:inline-block text-sm sm:text-base whitespace-nowrap">
                                        {t("send-message")}
                                    </span>
                                </button>
                            </div>

                            <div className="flex-col justify-center items-center mt-6">
                                <h2 className="text-center text-2xl font-semibold">{t("download-app")}</h2>
                                <div className="flex flex-col xs:flex-row gap-2 xs:gap-10 mt-4">
                                    <Link
                                        href="https://play.google.com/store/apps/details?id=com.spinet.spinetnfc&hl=en"
                                        className="flex items-center gap-1 text-azure font-medium"
                                    >
                                        <PlayStoreIcon className="w-8 h-8" />
                                        <span className="truncate">{t("from-play-store")}</span>
                                    </Link>
                                    <Link
                                        href="https://apps.apple.com/fr/app/spinet-nfc/id1606369890"
                                        className="flex items-center gap-1 text-azure font-medium"
                                    >
                                        <AppStoreIcon className="w-8 h-8" />
                                        <span className="truncate">{t("from-app-store")}</span>
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
            <div className="hidden sm:block max-w-4xl mx-auto px-4 mb-8 pt-12">
                {/* Banner and Profile Card */}
                <div className="bg-gray-200 dark:bg-navy rounded-3xl shadow-xl overflow-hidden mt-8">
                    {/* Banner */}
                    <div
                        className="relative h-48 bg-cover bg-center"
                        style={
                            profileData.profileCover
                                ? { backgroundImage: `url(/api/files/${profileData.profileCover})` }
                                : { backgroundImage: `url('/img/spinet-banner.jpg')` }
                        }
                    >
                        {/* Profile Image */}
                        <div className="absolute start-8 bottom-0 transform translate-y-1/2 w-32 h-32 bg-white rounded-full border-4 border-white">
                            <Image
                                priority
                                src={profileData.profilePicture ? `https:files.spinetnfc.com/files/${profileData.profilePicture}` : "/img/user.png"}
                                alt="Profile picture"
                                fill
                                className="rounded-full object-cover"
                            />
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
                            <h1 className="text-xl font-bold">{fullName}</h1>
                            <p className="text-sm text-gray-500">
                                {position} {company && t("at")} {company}
                            </p>
                        </div>

                        {/* Links Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {links.length > 0 ? (
                                links.map((link, index) => renderLink(link, index))
                            ) : (
                                <div className="col-span-2 text-center py-4 text-gray-500">{t("no-links")}</div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <AddContactButton />
                            <button className="bg-azure hover:bg-azure/70 text-white font-medium flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer">
                                <Send className="h-5 w-5" />
                                <span>{t("send-message")}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Download App Section (Outside Card) */}
                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4">{t("download-app")}</h2>
                    <div className="flex justify-center gap-10">
                        <Link
                            href="https://play.google.com/store/apps/details?id=com.spinet.spinetnfc&hl=en"
                            className="flex items-center gap-2 text-azure font-medium"
                        >
                            <PlayStoreIcon className="w-8 h-8" />
                            {t("from-play-store")}
                        </Link>
                        <Link
                            href="https://apps.apple.com/fr/app/spinet-nfc/id1606369890"
                            className="flex items-center gap-2 text-azure font-medium"
                        >
                            <AppStoreIcon className="w-8 h-8" />
                            {t("from-app-store")}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
