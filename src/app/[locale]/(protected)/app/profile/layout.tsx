import { Metadata } from "next"
import ContentLayout from "@/components/layouts/content-layout"

export const metadata: Metadata = {
    title: "Profile - Spinet",
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
        <ContentLayout locale={locale}>
            {children}
        </ContentLayout>
    )
} 