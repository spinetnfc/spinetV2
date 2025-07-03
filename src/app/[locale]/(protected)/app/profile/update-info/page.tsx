import Image from "next/image";
import {
    User,
    Edit,
    Settings,
    LinkIcon,

} from "lucide-react";
import useTranslate from "@/hooks/use-translate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllProfiles, getProfile } from "@/lib/api/profile";
import type { ProfileData } from "@/types/profile";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import ProfileForm from "@/components/pages/profile/profile-form";
import PreferencesForm from "@/components/pages/profile/preferences-form";
import AddLinkButton from "@/components/pages/profile/add-link-button";
import LinkItem from "@/components/pages/profile/link-item";
import ChangePicture from "@/components/pages/profile/change-picture";
import { RenderIcon } from "@/components/ui/renderIcon";


export default async function UpdateProfilePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);
    const user = await getUserCookieOnServer();
    const profileId = user?.selectedProfile || null;

    let profileData: ProfileData | null;

    try {
        profileData = await getProfile(profileId);
    } catch (err: any) {
        console.error("Error fetching profile:", err);
        throw new Error(`Failed to load profile data: ${err.message}`);
    }

    if (!profileData) {
        throw new Error("Profile data not found");
    }

    const fullName = profileData.fullName ? profileData.fullName : `${profileData.firstName} ${profileData.lastName}`
    const profilePictureUrl = profileData.profilePicture
        ? `/api/files/${profileData.profilePicture}`
        : "/img/user.png";
    const coverImageUrl = profileData.profileCover
        ? `/api/files/${profileData.profileCover}`
        : "";
    const themeColor = profileData.theme?.color || "#3b82f6"

    if (profileId) return (
        <div className="min-h-screen w-full -mt-12">
            {/* Profile Header */}
            <div
                className="relative w-full aspect-video md:max-h-96"
                style={
                    coverImageUrl
                        ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { backgroundColor: themeColor }
                }
            >
                <div className="absolute -bottom-12 xs:-bottom-14 sm:-bottom-16 left-4 sm:left-8">
                    <div className="relative">
                        <Image
                            priority
                            src={profilePictureUrl}
                            alt={fullName}
                            width={128}
                            height={128}
                            className="w-24 xs:w-28 sm:w-32 rounded-full border-4 bg-white border-white dark:border-gray-800"
                        />
                        <ChangePicture profileId={profileId} pictureType="profilePicture" />
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 pt-20 pb-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{fullName}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
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
                </div>

                <Tabs defaultValue="personal" className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger
                            value="personal"
                            className="flex items-center gap-[1px] sm:gap-2 text-[9px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <User className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("information")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="preferences"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Settings className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("preferences")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="links"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <LinkIcon className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("links")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-6">
                        <ProfileForm
                            profileData={profileData}
                            profileId={profileId || ""}
                            sectionName="profile"
                            locale={locale}
                        />
                    </TabsContent>


                    <TabsContent value="preferences" className="space-y-6">
                        <PreferencesForm
                            profileData={profileData}
                            profileId={profileId || ""}
                            sectionName="preferences"
                            locale={locale}
                        />
                    </TabsContent>

                    <TabsContent value="links" className="space-y-6">
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}