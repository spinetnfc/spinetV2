import Image from "next/image"
import { Edit, Briefcase, Globe, Linkedin, Instagram, Twitter, Github, LinkIcon, Facebook, MapPin, ShoppingCart, Store, Smartphone, MessageCircle, Send, ChevronRight } from 'lucide-react'
import { getProfile } from "@/lib/api/profile"
import type { ProfileData } from '@/types/profile';
import { getUserCookieOnServer } from "@/utils/server-cookie"
import Link from "next/link"
import AddLinkButton from "@/components/pages/profile/add-link-button"
import LinkItem from "@/components/pages/profile/link-item"
import useTranslate from "@/hooks/use-translate"

// Helper function to get the appropriate icon for a link type
function getLinkIcon(linkName: string, themeColor: string) {
    switch (linkName.toLowerCase()) {
        case "website":
            return <Globe style={{ color: themeColor }} size={24} />
        case "linkedin":
            return <Linkedin style={{ color: themeColor }} size={24} />
        case "instagram":
            return <Instagram style={{ color: themeColor }} size={24} />
        case "twitter":
            return <Twitter style={{ color: themeColor }} size={24} />
        case "github":
            return <Github style={{ color: themeColor }} size={24} />
        case "facebook":
            return <Facebook style={{ color: themeColor }} size={24} />
        case "location":
            return <MapPin style={{ color: themeColor }} size={24} />
        case "order now":
            return <ShoppingCart style={{ color: themeColor }} size={24} />
        case "play store":
            return <Store style={{ color: themeColor }} size={24} />
        case "app store":
            return <Smartphone style={{ color: themeColor }} size={24} />
        case "whatsapp":
            return <MessageCircle style={{ color: themeColor }} size={24} />
        case "telegram":
            return <Send style={{ color: themeColor }} size={24} />
        case "viber":
            return <MessageCircle style={{ color: themeColor }} size={24} />
        default:
            return <LinkIcon style={{ color: themeColor }} size={24} />
    }
}

export default async function ProfilePage({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);

    // Get user and profile ID from cookies
    const user = await getUserCookieOnServer()
    const profileId = user?.selectedProfile || null

    // Fetch user profile data
    let profileData: ProfileData | null

    try {
        profileData = await getProfile(profileId)
        console.log("profileData", profileData)
    } catch (err: any) {
        console.error("Error fetching profile:", err)
        throw new Error(`Failed to load profile data: ${err.message}`)
    }

    // No fallback data - if profile can't be loaded, show error
    if (!profileData) {
        throw new Error("Profile data not found")
    }

    const fullName = profileData.fullName ? profileData.fullName : `${profileData.firstName} ${profileData.lastName}`
    const profilePictureUrl = profileData.profilePicture ? `/api/files/${profileData.profilePicture}` : "/img/user.png"
    const coverImageUrl = profileData.profileCover ? `/api/files/${profileData.profileCover}` : ""
    const themeColor = profileData.theme?.color || "#3b82f6" // Default to blue if undefined

    return (
        <div className="min-h-screen w-full pb-4 -mt-12">
            {/* Header with gradient background */}
            <div className="relative z-0">
                <div
                    className="w-full aspect-video md:max-h-96"
                    style={
                        coverImageUrl
                            ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : { backgroundColor: themeColor }
                    }
                >
                </div>

                {/* Profile picture */}
                <div className="absolute -bottom-12 xs:-bottom-14 sm:-bottom-16 left-4 sm:left-8">
                    <div className="relative">
                        <Image
                            priority
                            src={profilePictureUrl || "/placeholder.svg"}
                            alt={fullName}
                            width={120}
                            height={120}
                            className="w-24 xs:w-28 sm:w-32 rounded-full border-4 bg-white border-white dark:border-gray-800"
                        />
                    </div>
                </div>

            </div>

            {/* Profile info */}
            <div className="flex items-start mt-20 px-6 gap-2">
                <div>
                    <h1 className="text-2xl font-bold">{fullName}</h1>
                    <p className="text-gray-500">
                        {profileData.position} {profileData.companyName ? `${t("at")} ${profileData.companyName}` : ""}
                    </p>
                </div>
                <Link href={`./profile/update-info`} className="text-primary hover:scale-105 cursor-pointer pt-1">
                    <Edit size={20} />
                </Link>
            </div>

            {/* Profile sections */}
            <div className="px-6 mt-8 space-y-4">
                {/* Services */}
                <Link href={`./profile/services`} className="block">
                    <div className="bg-blue-200 dark:bg-navy rounded-lg p-4 hover:bg-blue-300 dark:hover:bg-blue-900 transition-colors">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: themeColor }}>
                                    <Briefcase className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">{t("my-services")}</h2>
                                    <p className="text-gray-500 text-sm">
                                        1 {t("services")}
                                    </p>
                                </div>
                            </div>
                            <div className="text-gray-500">
                                <ChevronRight size={20} className={locale === "ar" ? "transition rotate-180" : ""} />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Personal links section */}
                <div className="flex justify-between items-center mt-6">
                    <h2 className="text-xl font-semibold">{t("personal-links")}</h2>
                    {profileId && <AddLinkButton profileId={profileId} profileData={profileData} />}
                </div>

                {/* Dynamic links in a grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.links.map((link, index) => (
                        <LinkItem
                            key={index}
                            link={link}
                            index={index}
                            profileId={profileId || ""}
                            profileData={profileData}
                            themeColor={themeColor}
                            icon={getLinkIcon(link.name, themeColor)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

