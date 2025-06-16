import Image from "next/image";
import {
    User,
    Edit,
    // Activity,
    Settings,
    // Shield,
    // ArrowLeft,
} from "lucide-react";
import useTranslate from "@/hooks/use-translate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getAllProfiles, getProfile } from "@/lib/api/profile";
import type { ProfileData } from "@/types/profile";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import ProfileForm from "@/components/pages/profile/profile-form";
import PreferencesForm from "@/components/pages/profile/preferences-form";
// import ChangeEmailForm from "@/components/pages/profile/change-email-form";
// import Link from "next/link";
// import { deleteProfileAction, getAllProfilesAction } from "@/actions/profile";
// import { profile } from "console";

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

    // const handleDeleteProfile = async () => {
    //     "use server";
    //     const profiles = getAllProfilesAction(user?._id || "");
    //     "use client";
    //     const profilesArr = await profiles;
    //     const currentIndex = profilesArr.findIndex((p: any) => p._id === profileId);
    //     if (currentIndex !== -1 && profilesArr.length > 1) {
    //         const nextIndex = (currentIndex + 1) % profilesArr.length;
    //         const nextProfileId = profilesArr[nextIndex]._id;
    //         // Update the user cookie with the new selected profile (client-side)
    //         document.cookie = `current-user=${JSON.stringify({ ...user, selectedProfile: nextProfileId })}; path=/`;
    //     }
    //     await deleteProfileAction(profileId || "");
    // }
    return (
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
                        <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg">
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 pt-20 pb-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{fullName}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {profileData.position} {profileData.companyName ? `${t("at")} ${profileData.companyName}` : ""}
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="personal" className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger
                            value="personal"
                            className="flex items-center gap-[1px] sm:gap-2 text-[9px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <User className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("information")}
                        </TabsTrigger>
                        {/* <TabsTrigger
                            value="security"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Shield className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("security")}
                        </TabsTrigger> */}
                        <TabsTrigger
                            value="preferences"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Settings className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("preferences")}
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

                    {/* <TabsContent value="security" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Button variant="destructive" className="w-fit" onClick={handleDeleteProfile}>
                                {t("delete-profile")}
                                <Edit className="me-2 h-4 w-4" />
                            </Button>
                        </div>
                    </TabsContent> */}


                    <TabsContent value="preferences" className="space-y-6">
                        <PreferencesForm
                            profileData={profileData}
                            profileId={profileId || ""}
                            sectionName="preferences"
                            locale={locale}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}