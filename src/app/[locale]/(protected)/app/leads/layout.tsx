import { Metadata } from "next"
import ContentLayout from "@/components/layouts/content-layout"

export const metadata: Metadata = {
    title: "Leads",
    description: "Manage your leads on Spinet",
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