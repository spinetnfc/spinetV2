"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserIcon, BriefcaseIcon } from "lucide-react"

interface SearchTabsProps {
    activeTab: string
}

export function SearchTabs({ activeTab }: SearchTabsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", value)
        // Reset page when changing tabs
        params.delete("page")
        router.push(`?${params.toString()}`)
    }

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
                <TabsTrigger value="people" className="gap-2">
                    <UserIcon className="h-4 w-4" />
                    People
                </TabsTrigger>
                <TabsTrigger value="offers" className="gap-2">
                    <BriefcaseIcon className="h-4 w-4" />
                    Offers
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

