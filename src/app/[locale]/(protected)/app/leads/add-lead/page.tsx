import AddLeadForm from "@/components/pages/leads/add-lead-form";

export default async function AddLeadPage({ params }: { params: Promise<{ locale: string }>; }) {
    const { locale } = await params;
    return (
        <div className="px-2 xs:px-4 py-4 max-w-4xl mx-auto">
            <AddLeadForm locale={locale} />
        </div>
    );
} 