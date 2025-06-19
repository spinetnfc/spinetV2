import { Edit, QrCode, Upload } from "lucide-react";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import { getProfile, viewProfile } from "@/lib/api/profile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddContactForm from "@/components/pages/contacts/add-contact-form";
import ImportContacts from "@/components/pages/contacts/import-contacts";
import useTranslate from "@/hooks/use-translate";
import { ProfileData } from "@/types/profile";
import ScanContact from "@/components/pages/contacts/scan-contact";
// import Link from "next/link";
export default async function AddContactPage({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);
    // Get user and profile data
    const user = await getUserCookieOnServer();
    const profileId = user?.selectedProfile || null;

    // Fetch profile data for the header
    let profileData;
    try {
        profileData = await getProfile(profileId);
    } catch (error) {
        console.error("Error fetching profile:", error);
    }

    // Get user name and profile picture
    const fullName = profileData
        ? `${profileData.firstName} ${profileData.lastName}`
        : "User";
    const profilePictureUrl = profileData?.profilePicture
        ? `/api/files/${profileData.profilePicture}`
        : "/img/user.png";

    const getProfileData = async (profileId: string, userId = user?._id): Promise<ProfileData | null> => {
        "use server";
        if (userId && profileId) {
            try {
                const profileData = await viewProfile(profileId, userId);
                return profileData;
            } catch (error) {
                console.error("Error fetching profile:", error);
                return null;
            }
        }
        console.error("Profile ID or User ID is missing");
        return null;

    }
    // Handle form submission


    return (
        <div className="min-h-screen pt-16">
            {/* <div className="w-full flex items-center m-6">
                <Link href={`./`} className="p-2 rounded-full bg-white/20 text-white me-4">
                    <ArrowLeft size={24} className={locale === "ar" ? "transition rotate-180" : ""} />
                </Link>
            </div> */}
            <div className="px-4 py-2 max-w-4xl mx-auto">
                <Tabs defaultValue="manual" className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="manual" className="text-xs sm:text-sm">
                            <Edit size={16} className="me-0.5 sm:me-2" />
                            {t("manual")}
                        </TabsTrigger>
                        <TabsTrigger value="scan" className="text-xs sm:text-sm">
                            <QrCode size={16} className="me-0.5 sm:me-2" />
                            {t("scan")}
                        </TabsTrigger>
                        <TabsTrigger value="import" className="text-xs sm:text-sm">
                            <Upload size={16} className="me-0.5 sm:me-2" />
                            {t("import")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
                        <AddContactForm locale={locale} />
                    </TabsContent>

                    <TabsContent value="scan">
                        <ScanContact locale={locale} getProfileData={getProfileData} />
                    </TabsContent>


                    <TabsContent value="import">
                        <ImportContacts locale={locale} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}