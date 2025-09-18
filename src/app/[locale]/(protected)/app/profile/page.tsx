import Image from "next/image"
import { Edit, Briefcase, ChevronRight } from 'lucide-react'
import type { ProfileData } from '@/types/profile';
import Link from "next/link"
import AddLinkButton from "@/components/pages/profile/add-link-button"
import LinkItem from "@/components/pages/profile/link-item"
import useTranslate from "@/hooks/use-translate"
import { Service } from "@/types/services";
import { Card, CardContent } from "@/components/ui/card";
import { RenderIcon } from "@/components/ui/renderIcon";

// Mock profile data
const mockProfileData: ProfileData = {
    _id: "mock-profile-id",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    status: "employee",
    type: "personal",
    groupId: "mock-group-id",
    birthDate: "1990-01-01",
    gender: "male",
    position: "Software Engineer",
    companyName: "Tech Corp",
    school: "",
    profilePicture: "",
    profileCover: "",
    theme: { color: "#3b82f6" },
    links: [
        { name: "linkedin", link: "https://linkedin.com/in/johndoe", title: "LinkedIn" },
        { name: "email", link: "john@example.com", title: "Email" },
        { name: "website", link: "https://johndoe.dev", title: "Website" }
    ],
    lockedFeatures: {
        profileCover: false,
        logo: false,
        qrCodeLogo: false,
        displayLogo: false,
        companyName: false,
        activitySector: false,
        position: false,
        school: false,
        profession: false,
        theme: false,
        canAddLinks: true,
        canAddServices: true,
        excludedLinks: []
    }
};

// Mock services data  
const mockServices: Service[] = [
    { _id: "1", name: "Web Development", description: "Full-stack development services" },
    { _id: "2", name: "Consulting", description: "Technical consulting and architecture" }
];

export default async function ProfilePage({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);

    // Use hardcoded data instead of backend calls
    const profileData = mockProfileData;
    const services = mockServices;
    const profileId = "mock-profile-id";

    const fullName = profileData.fullName || `${profileData.firstName} ${profileData.lastName}`;
    const profilePictureUrl = "/img/user.png"; // Use default image
    const coverImageUrl = ""; // No cover image
    const themeColor = profileData.theme?.color || "#3b82f6";

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
                        {profileData.status === "student" ? (
                            <>
                                {t("student")} {t("at")} {profileData.school}
                            </>
                        ) : profileData.status === "employee" ? (
                            <>
                                {profileData.position} {t("at")} {profileData.companyName}
                            </>
                        ) : profileData.status === "professional" ? (
                            profileData.companyName
                        ) : null}
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
                    <Card className="bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700 hover:bg-slate-750 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: themeColor }}>
                                    <Briefcase className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">{t("my-services")}</h2>
                                    <p className="text-gray-500 text-sm">
                                        {services.length} {services.length === 1 ? t("service") : t("services")}
                                    </p>
                                </div>
                            </div>
                            <div className="text-gray-500">
                                <ChevronRight size={20} className={locale === "ar" ? "transition rotate-180" : ""} />
                            </div>
                        </CardContent>
                    </Card>
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
                            icon={<RenderIcon iconType={link.name} className="w-5 h-5 text-azure" />}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

