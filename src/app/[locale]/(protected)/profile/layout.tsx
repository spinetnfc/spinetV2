import { Metadata } from "next"
import PublicProfileLayout from "@/components/layouts/profile-layout"

export const metadata: Metadata = {
    title: "Profile | Spinet",
    description: "Manage your Spinet profile and settings",
}

export default async function ProfileLayout({
    params,
    children,
}: {
    children: React.ReactNode,
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <PublicProfileLayout locale={locale}>
            {children}
        </PublicProfileLayout>
    )
} 