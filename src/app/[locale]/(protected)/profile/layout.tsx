import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Profile | Spinet",
    description: "Manage your Spinet profile and settings",
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container mx-auto px-4 py-8">
            {children}
        </div>
    )
} 