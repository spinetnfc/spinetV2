import type React from "react"
import Image from "next/image"
import {
    Phone,
    Mail,
    Edit,
    ChevronRight,
    Briefcase,
    ArrowLeft,
    Globe,
    Linkedin,
    Instagram,
    Twitter,
    Github,
    LinkIcon,
} from "lucide-react"
import { getProfile, type ProfileData } from "@/lib/api/profile"
import { getUserCookieOnServer } from "@/utils/cookies"
import Link from "next/link"

// Helper function to get the appropriate icon for a link type
function getLinkIcon(linkName: string) {
    switch (linkName.toLowerCase()) {
        case "email":
            return <Mail className="text-orange-400" size={20} />
        case "phone":
            return <Phone className="text-orange-400" size={20} />
        case "website":
            return <Globe className="text-orange-400" size={20} />
        case "linkedin":
            return <Linkedin className="text-orange-400" size={20} />
        case "instagram":
            return <Instagram className="text-orange-400" size={20} />
        case "twitter":
            return <Twitter className="text-orange-400" size={20} />
        case "github":
            return <Github className="text-orange-400" size={20} />
        default:
            return <LinkIcon className="text-orange-400" size={20} />
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
    const email = profileData.links.find((link) => link.name === "email")?.title || ""
    const phone = profileData.links.find((link) => link.name === "phone")?.title || ""

    return (
        <div className="min-h-screen w-full">
            {/* Header with gradient background */}
            <div className="relative">
                <div
                    className="h-48 bg-gradient-to-r from-blue-700 via-blue-600 to-pink-400"
                    style={
                        coverImageUrl
                            ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : profileData.theme?.color
                                ? { backgroundColor: profileData.theme.color }
                                : {}
                    }
                >
                    <div className="absolute top-4 left-4">
                        <button className="p-2 rounded-full bg-white/20 text-white">
                            <ArrowLeft size={24} />
                        </button>
                    </div>
                </div>

                {/* Profile picture */}
                <div className="absolute left-6 -bottom-16">
                    <div className="relative">
                        <Image
                            src={profilePictureUrl || "/placeholder.svg"}
                            alt={fullName}
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-white"
                        />
                        <button className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-700 text-white">
                            <Edit size={16} />
                        </button>
                    </div>
                </div>

                {/* Contact buttons */}
                <div className="absolute right-6 bottom-6 flex gap-3">
                    {phone && (
                        <a href={`tel:${phone}`} className="p-4 rounded-full bg-orange-400 text-white">
                            <Phone size={20} />
                        </a>
                    )}
                    {email && (
                        <a href={`mailto:${email}`} className="p-4 rounded-full bg-orange-400 text-white">
                            <Mail size={20} />
                        </a>
                    )}
                </div>
            </div>

            {/* Profile info */}
            <div className="mt-20 px-6">
                <h1 className="text-2xl font-bold">{fullName}</h1>
                <p className="text-gray-500">
                    {profileData.position} {profileData.companyName ? `at ${profileData.companyName}` : ""}
                </p>
            </div>


            {/* Profile sections */}
            <div className="px-6 mt-8 space-y-4">
                {/* Lead captions */}
                <div className="bg-navy rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Lead captions</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-gray-500">
                            <Edit size={18} />
                        </button>
                        <ChevronRight className="text-gray-400" size={20} />
                    </div>
                </div>

                {/* Services */}
                <div className="bg-navy rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-400 rounded-lg">
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
                </div>

                {/* Personal links section */}
                <h2 className="text-xl font-semibold mt-6">Personal links</h2>

                {/* Dynamic links */}
                {profileData.links.map((link, index) => {
                    const isClickableLink = link.name !== "email" && link.name !== "phone" && link.link

                    const LinkWrapper = ({ children }: { children: React.ReactNode }) => {
                        if (isClickableLink) {
                            return (
                                <Link href={link.link || "#"} target="_blank" rel="noopener noreferrer" className="block">
                                    {children}
                                </Link>
                            )
                        }
                        return <>{children}</>
                    }

                    return (
                        <LinkWrapper key={index}>
                            <div className="bg-navy rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-orange-100 rounded-lg">{getLinkIcon(link.name)}</div>
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                                            </h2>
                                            <p className="text-gray-500">{link.title || ""}</p>
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
                            </div>
                        </LinkWrapper>
                    )
                })}
            </div>

        </div>
    )
}
