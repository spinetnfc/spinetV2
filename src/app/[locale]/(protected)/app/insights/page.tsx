"use client"
import InsightsPage from "@/components/pages/insights/insights-page";

// Mock insights page - all backend calls removed
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
        // Mock insights - replace with hardcoded data
        insights = {
            views: 150,
            taps: 45,
            links: [],
            connections: 10,
            score: 75,
            trees: 5,
            economized: 100
        };
    } catch (error) {
        console.error("Error fetching insights:", error);
        // Optionally return fallback UI or use default insights
        return <div>Error loading insights</div>;
    }

    return <InsightsPage profileId={profileId} profileInsights={insights} />;
}