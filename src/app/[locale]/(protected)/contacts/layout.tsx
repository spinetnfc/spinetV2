import { Metadata } from "next"
import PublicProfileLayout from "@/components/layouts/profile-layout"

export const metadata: Metadata = {
    title: "Contacts",
    description: "Manage your contacts Spinet",
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