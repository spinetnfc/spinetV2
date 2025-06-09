import Image from "next/image";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Instagram,
    Twitter,
    Github,
    Edit,
    Lock,
    Bell,
    Activity,
    Settings,
    Shield,
    Key,
    Eye,
    EyeOff,
    // ArrowLeft,
} from "lucide-react";
import useTranslate from "@/hooks/use-translate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/api/profile";
import type { ProfileData } from "@/types/profile";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import ProfileForm from "@/components/pages/profile/profile-form";
import PreferencesForm from "@/components/pages/profile/preferences-form";
import ChangeEmailForm from "@/components/pages/profile/change-email-form";
import Link from "next/link";

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
        console.log("profileData : ", profileData);
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

    return (
        <div className="min-h-screen w-full">
            {/* Profile Header */}
            <div
                className="relative w-full aspect-video md:max-h-96 bg-gradient-to-r from-blue-500 to-purple-600"
                style={
                    coverImageUrl
                        ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : profileData.theme?.color
                            ? { backgroundColor: profileData.theme.color }
                            : {}
                }
            >
                {/* <div className="absolute top-4 start-4">
                    <Link href="./" className="p-2 rounded-full bg-white/20 text-white inline-flex items-center">
                        <ArrowLeft size={24} />
                    </Link>
                </div> */}
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
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger
                            value="personal"
                            className="flex items-center gap-[1px] sm:gap-2 text-[9px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <User className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("information")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Shield className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("security")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="activity"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Activity className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            {t("activity")}
                        </TabsTrigger>
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

                    <TabsContent value="security" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {user && <ChangeEmailForm
                                    user={user}
                                />}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">{t("account-security")}</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{t("change-password")}</h3>
                                        </div>
                                        <Link href={`/${locale}/auth/forgot-password`}>
                                            <Button variant="default">{t("change-password")}</Button>
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {/* <div>
                                            <h3 className="font-medium">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-500">
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                        <Button variant="default">Enable</Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Active Sessions</h3>
                                            <p className="text-sm text-gray-500">
                                                View your active sessions
                                            </p>
                                        </div>
                                        <Button variant="outline">View All</Button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold"> {t("recent-activity")}</h2>
                            <div className="p-4 border rounded-lg">
                                <p className="text-center text-gray-500">{t("no-recent-activity")}</p>
                            </div>
                        </div>
                    </TabsContent>

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