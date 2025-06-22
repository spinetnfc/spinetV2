import InsightsPage from "@/components/pages/insights/insights-page";
import { getInsights } from "@/lib/api/profile";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import { format } from "date-fns";
import type { Insights } from "@/types/profile";

export default async function Page() {
    const user = await getUserCookieOnServer();
    const profileId = user?.selectedProfile || null;
    const today = format(new Date(), "yyyy-MM-dd");

    if (!profileId) {
        return <div>Loading...</div>;
    }

    let insights: Insights = {
        links: [],
        views: 0,
        connections: 0,
        score: 0,
        trees: 0,
        economized: 0,
        taps: 0
    };

    try {
        insights = await getInsights(profileId, { startDate: "2021-01-01", endDate: today });
    } catch (error) {
        console.error("Error fetching insights:", error);
        // Optionally return fallback UI or use default insights
        return <div>Error loading insights</div>;
    }

    return <InsightsPage profileId={profileId} profileInsights={insights} />;
}