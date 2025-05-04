import Image from "next/image"
import { Phone, Mail, Edit, Briefcase, ArrowLeft, Globe, Linkedin, Instagram, Twitter, Github, LinkIcon, Facebook, MapPin, ShoppingCart, Store, Smartphone, MessageCircle, Send } from 'lucide-react'
import { getProfile, type ProfileData } from "@/lib/api/profile"
import { getUserCookieOnServer } from "@/utils/cookies"
import Link from "next/link"
import AddLinkButton from "@/components/pages/profile/add-link-button"
import LinkItem from "@/components/pages/profile/link-item"

// Helper function to get the appropriate icon for a link type
function getLinkIcon(linkName: string, themeColor: string) {
    switch (linkName.toLowerCase()) {
        case "email":
            return <Mail style={{ color: themeColor }} size={24} />
        case "phone":
            return <Phone style={{ color: themeColor }} size={24} />
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

export default async function ProfilePage() {
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

    const fullName = `${profileData.firstName} ${profileData.lastName}`
    const profilePictureUrl = profileData.profilePicture ? `/api/files/${profileData.profilePicture}` : "/img/user.png"
    const coverImageUrl = profileData.profileCover ? `/api/files/${profileData.profileCover}` : ""
    const email = profileData.links.find((link) => link.name === "email")?.title || "user@email.com"
    const phone = profileData.links.find((link) => link.name === "phone")?.title || "0666778899"
    const themeColor = profileData.theme?.color || "#3b82f6" // Default to blue if undefined

    return (
        <div className="min-h-screen w-full">
            {/* Header with gradient background */}
            <div className="relative">
                <div
                    className="w-full aspect-video md:max-h-96 bg-gradient-to-r from-blue-700 via-blue-600 to-pink-400"
                    style={
                        coverImageUrl
                            ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : { backgroundColor: themeColor }
                    }
                >
                    <div className="absolute top-4 left-4">
                        <button className="p-2 rounded-full bg-white/20 text-white">
                            <ArrowLeft size={24} />
                        </button>
                    </div>
                </div>

                {/* Profile picture */}
                <div className="absolute -bottom-12 xs:-bottom-14 sm:-bottom-16 left-4 sm:left-8">
                    <div className="relative">
                        <Image
                            src={profilePictureUrl || "/placeholder.svg"}
                            alt={fullName}
                            width={120}
                            height={120}
                            className="w-24 xs:w-28 sm:w-32 rounded-full border-4 bg-white border-white dark:border-gray-800"
                        />
                    </div>
                </div>

                {/* Contact buttons */}
                <div className="absolute right-6 bottom-6 flex gap-3">
                    {phone && (
                        <a href={`tel:${phone}`} className="p-4 rounded-full text-white" style={{ backgroundColor: themeColor }}>
                            <Phone size={20} />
                        </a>
                    )}
                    {email && (
                        <a href={`mailto:${email}`} className="p-4 rounded-full text-white" style={{ backgroundColor: themeColor }}>
                            <Mail size={20} />
                        </a>
                    )}
                </div>
            </div>

            {/* Profile info */}
            <div className="flex items-start mt-20 px-6">
                <div>
                    <h1 className="text-2xl font-bold">{fullName}</h1>
                    <p className="text-gray-500">
                        {profileData.position} {profileData.companyName ? `at ${profileData.companyName}` : ""}
                    </p>
                </div>
                <Link href={`/profile/update-info`} className="text-primary hover:scale-105 cursor-pointer">
                    <Edit size={20} />
                </Link>
            </div>

            {/* Profile sections */}
            <div className="px-6 mt-8 space-y-4">
                {/* Services */}
                {/* <div className="bg-navy rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColor }}>
                                <Briefcase className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Services I provide</h2>
                                <p className="text-gray-500 text-sm">1 service</p>
                            </div>
                        </div>
                        <button className="text-gray-500">
                            <div className="flex flex-col gap-1">
                                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                            </div>
                        </button>
                    </div>
                </div> */}

                {/* Personal links section */}
                <div className="flex justify-between items-center mt-6">
                    <h2 className="text-xl font-semibold">Personal links</h2>
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

