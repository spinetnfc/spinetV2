"use client"
import { useState } from "react";
import { cn } from "@/utils/cn";

/** Simple client component for the tabs. Replace with your UI library if desired. */
export default function ProductTabs({ details }: { details: string[] }) {
    const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

    return (
        <div>
            <div className="mb-4 flex space-x-4 border-b pb-2">
                <button
                    className={cn(
                        "pb-2 text-sm font-semibold",
                        activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                    )}
                    onClick={() => setActiveTab("details")}
                >
                    Product Details
                </button>
                <button
                    className={cn(
                        "pb-2 text-sm font-semibold",
                        activeTab === "reviews" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                    )}
                    onClick={() => setActiveTab("reviews")}
                >
                    Rating & Reviews
                </button>
            </div>

            {activeTab === "details" ? (
                <ul className="list-disc space-y-2 pl-4 text-gray-700 dark:text-gray-200">
                    {details.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            ) : (
                <div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                        Ratings & Reviews
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {/* Replace with your actual reviews component or logic */}
                        No reviews yet. Be the first to leave a review!
                    </p>
                </div>
            )}
        </div>
    );
}