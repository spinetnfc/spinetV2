import { ArrowLeft, Briefcase } from "lucide-react"
import Link from "next/link"
import { getProfile } from "@/lib/api/profile"
import type { ProfileData } from "@/types/profile"
import { getUserCookieOnServer } from "@/utils/server-cookie"
import ServiceItem from "@/components/pages/profile/services/service-item"
import AddServiceButton from "@/components/pages/profile/services/add-service-button"
import { getServices } from "@/lib/api/services"
import { Service } from "@/types/services"
import useTranslate from "@/hooks/use-translate"

export default async function ServicesPage({
    params,
}: {
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
    } catch (err: any) {
        console.error("Error fetching profile:", err)
        throw new Error(`Failed to load profile data: ${err.message}`)
    }

    let services: Service[] = []
    try {
        services = await getServices(profileId);
        console.log("services", services)
    } catch (err: any) {
        console.error("Error fetching services:", err);
    }
    if (!profileData) {
        throw new Error("Profile data not found")
    }

    const fullName = profileData.fullName ? profileData.fullName : `${profileData.firstName} ${profileData.lastName}`
    const themeColor = profileData.theme?.color || "#3b82f6" // Default to blue if undefined


    return (
        <div className="min-h-screen w-full">
            {/* Header */}
            <div className="w-full h-32 flex items-center px-6" style={{ backgroundColor: themeColor }}>
                <Link href={`./`} className="p-2 rounded-full bg-white/20 text-white me-4">
                    <ArrowLeft size={24} className={locale === "ar" ? "transition rotate-180" : ""} />
                </Link>
                <h1 className="text-2xl font-bold text-white">{t("my-services")}</h1>
            </div>

            {/* Content */}
            <div className="px-6 -mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColor }}>
                                <Briefcase className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{t("services-by")} {fullName}</h2>
                                <p className="text-gray-500">{t("Showcase-expertise")}</p>
                            </div>
                        </div>
                        {profileId && <AddServiceButton profileId={profileId} profileData={profileData} />}
                    </div>

                    {/* Services list */}
                    {services.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <Briefcase className="mx-auto text-gray-400" size={48} />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{t("No-services-yet")}</h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {t("add-first-service-message")}
                            </p>
                            {profileId && (
                                <div className="w-full flex justify-center mt-6">
                                    <AddServiceButton
                                        profileId={profileId}
                                        profileData={profileData}
                                        buttonText="add-first-service"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {services.map((service, index) => (
                                <ServiceItem
                                    key={index}
                                    service={service}
                                    profileId={profileId || ""}
                                    themeColor={themeColor}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
