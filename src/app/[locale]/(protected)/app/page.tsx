import ProfileCarousel from "@/components/pages/profile/profiles-carousel";
import { Button } from "@/components/ui/button";
import useTranslate from "@/hooks/use-translate";
import { ProfileData } from "@/types/profile";
import { getLocale } from "@/utils/getServerLocale";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import { ScanLine } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const user = await getUserCookieOnServer();
  const locale = await getLocale();
  const { t } = await useTranslate(locale || 'en'); // Providing a default value of 'en'


  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  let profiles: ProfileData[] = [];
  try {
    // Mock profiles - replace with hardcoded data
    profiles = [
      {
        _id: "mock-profile-1",
        fullName: "John Doe",
        status: "professional",
        profession: "Software Engineer",
        profilePicture: "",
        profileCover: "",
        theme: { color: "#3b82f6" },
        links: [],
        type: "personal",
        groupId: "mock-group-1",
        birthDate: "1990-01-01",
        gender: "male",
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
          canAddLinks: false,
          canAddServices: false,
          excludedLinks: []
        }
      }
    ];
    const selectedIndex = profiles.findIndex(p => p._id === user.selectedProfile);
    if (selectedIndex > 0) {
      const [selectedProfile] = profiles.splice(selectedIndex, 1);
      profiles.unshift(selectedProfile);
    }
  } catch (error) {
    console.error("Error fetching profiles:", error);
  }
  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col items-center justify-center">
      <ProfileCarousel profiles={profiles} />
      <Button asChild size="lg">
        <Link href={`/${locale}/app/contacts/add-contact`} className="flex items-center mt-4">
          <ScanLine className="me-1" strokeWidth={2} />
          {t("scan-contact")}
        </Link>
      </Button>
    </div>
  )
}
