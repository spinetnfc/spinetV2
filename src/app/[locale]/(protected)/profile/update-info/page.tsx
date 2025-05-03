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
} from "lucide-react";
import useTranslate from "@/hooks/use-translate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfile, ProfileData } from "@/lib/api/profile";
import SaveButton from "@/components/pages/profile/save-button";
import { cookies } from "next/headers";
import { getUserCookieOnServer } from "@/utils/cookies";
import ProfileForm from "@/components/pages/profile/profile-form";
import PreferencesForm from "@/components/pages/profile/preferences-form"; // New component

export default async function UpdateProfilePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);
    const user = await getUserCookieOnServer();
    const profileId = user?.selectedProfile || null;

    // Fetch user profile using getProfile
    let profileData: ProfileData | null;

    try {
        profileData = await getProfile(profileId);
        console.log("profileData : ", profileData);
    } catch (err: any) {
        console.error("Error fetching profile:", err);
        throw new Error(`Failed to load profile data: ${err.message}`);
    }

    // No fallback data - if profile can't be loaded, show error
    if (!profileData) {
        throw new Error("Profile data not found");
    }

    const fullName = `${profileData.firstName} ${profileData.lastName}`;
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
                <div className="absolute -bottom-12 xs:-bottom-14 sm:-bottom-16 left-4 sm:left-8">
                    <div className="relative">
                        <Image
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
                            {profileData.position} {profileData.companyName ? `at ${profileData.companyName}` : ""}
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger
                            value="personal"
                            className="flex items-center gap-[1px] sm:gap-2 text-[9px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <User className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Shield className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger
                            value="activity"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Activity className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            Activity
                        </TabsTrigger>
                        <TabsTrigger
                            value="preferences"
                            className="flex items-center gap-[1px] sm:gap-2 text-[10px] xs:text-[11px] sm:text-sm px-0"
                        >
                            <Settings className="xs:h-3 xs:w-3 sm:w-4 sm:h-4" />
                            Preferences
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-6">
                        <ProfileForm
                            profileData={profileData}
                            profileId={profileId || ""}
                            sectionName="profile"
                            locale={locale}
                        />
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <form id="security-form">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Password</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
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
                                            <Button variant="outline">View All</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <SaveButton profileId={profileId || ""} sectionName="security" />
                            </div>
                        </form>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Recent Activity</h2>
                            <div className="p-4 border rounded-lg">
                                <p className="text-center text-gray-500">No recent activity to display.</p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Preferences Tab */}
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