"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// import { Linkedin, Globe, Phone, Facebook, Instagram, Youtube, Mail, Twitter, Store, Github, ArrowDownUp, Eye, UserPlus } from "lucide-react"
import { ArrowDownUp, Eye, UserPlus } from "lucide-react"
import { getInsightsAction } from "@/actions/profile"
import { format, subDays } from "date-fns"
import { FormattedMessage } from "react-intl"
import type { Insights } from "@/types/profile"
import goldMedal from "@/assets/images/medals/medal_Gold.png";
import silverMedal from "@/assets/images/medals/medal_silver.png";
import bronzeMedal from "@/assets/images/medals/medal_Bronze.png";
import Image from "next/image"
import { RenderIcon } from "@/components/ui/renderIcon"

// const getLinkIcon = (name: string) => {
//     const iconComponents: { [key: string]: any } = {
//         linkedin: Linkedin,
//         website: Globe,
//         email: Mail,
//         facebook: Facebook,
//         github: Github,
//         phone: Phone,
//         instagram: Instagram,
//         youtuibe: Youtube,
//         twitter: Twitter,
//         store: Store,
//     }
//     return iconComponents[name] || Globe
// }

const getUserLevel = (score: number) => {
    if (score >= 1000) return { level: "Gold", progress: score / 2000 * 100 }
    if (score >= 500) return { level: "Silver", progress: score / 1000 * 100 }
    return { level: "Bronze", progress: score / 500 * 100 }
}

export default function InsightsPage({ profileId, profileInsights }: { profileId: string, profileInsights: Insights }) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const periods = [
        {
            label: "all",
            startDate: "2021-01-01",
            endDate: today
        },
        {
            label: "last-week",
            startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
            endDate: today
        },
        {
            label: "last-month",
            startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
            endDate: today
        },
        {
            label: "last-year",
            startDate: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
            endDate: today
        }
    ]
    const [insights, setInsights] = useState<Insights>(profileInsights)
    const [selectedPeriod, setSelectedPeriod] = useState(periods[0])
    const userLevel = getUserLevel(insights.score)


    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await getInsightsAction(profileId, selectedPeriod);
                setInsights(response);
            } catch (error) {
                console.error("Error fetching insights:", error);
            }
        }

        fetchInsights();
    }, [selectedPeriod])


    return (
        <div className="min-h-screen w-full absolute top-0">
            <div className="px-6 pb-6 text-center min-h-[calc(100vh/2)] pt-12">
                <div className="flex flex-col items-center space-y-6">
                    {/* Level Badge */}
                    <div className="relative">
                        <Image
                            src={userLevel.level === "Gold" ? goldMedal : userLevel.level === "Silver" ? silverMedal : bronzeMedal}
                            alt="User Level Badge"
                            className="h-32 w-32"
                        />
                        <div className="mt-4">
                            <Progress value={userLevel.progress} className="w-32 h-2" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold "><FormattedMessage id="your-level-is" />
                            {userLevel.level === "Gold" ? <FormattedMessage id="Gold" /> : userLevel.level === "Silver" ? <FormattedMessage id="Silver" /> : <FormattedMessage id="Bronze" />}
                        </p>
                    </div>

                    {/* Environmental Impact */}
                    <div className="flex flex-col items-center space-y-2 ">
                        <div className="text-5xl">🌳</div>
                        <div className="text-3xl font-bold">{insights.connections}</div>
                        <p className="text-sm opacity-90"><FormattedMessage id="new-connection" defaultMessage="New-connection 🔥" /></p>
                        <p className="text-sm opacity-80 text-center max-w-xs">
                            <FormattedMessage id="you-ecconomised"
                                defaultMessage={`You economised up to ${insights.economized}.00 DA and saved ${insights.trees} tree in our planet`}
                                values={{ economy: insights.economized, trees: insights.trees }}
                            />
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-200 dark:bg-slate-800 rounded-t-3xl px-6 py-8 space-y-6 min-h-[calc(100vh/2)]">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold ">
                        <FormattedMessage id="general-statistics" defaultMessage="General Statistics" />
                    </h2>

                    {/* Period Buttons */}
                    <div className="flex flex-wrap">
                        {periods.map((period) => (
                            <Button
                                key={period.label}
                                variant={selectedPeriod.label === period.label ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedPeriod(period)}
                                className={`text-xs sm:text-sm whitespace-nowrap ${selectedPeriod.label === period.label
                                    ? "bg-azure"
                                    : "text-primary hover: hover:bg-blue-200"
                                    }`}
                            >
                                <FormattedMessage id={period.label} />
                            </Button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="w-full flex gap-4 max-sm:flex-wrap">
                        <Card className="sm:w-full bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700">
                            <CardContent className="p-2 sm:p-4 flex items-center space-x-3">
                                <div className="p-2 bg-blue-400/20 rounded-lg">
                                    <ArrowDownUp className="w-5 h-5 text-azure" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        <FormattedMessage id="profile-taps" defaultMessage="Profile Taps" />
                                    </p>
                                    <p className="text-lg sm:text-2xl font-bold ">{insights.taps}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="sm:w-full bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700">
                            <CardContent className="p-2 sm:p-4 flex items-center space-x-3">
                                <div className="p-2 bg-blue-400/20 rounded-lg">
                                    <Eye className="w-5 h-5 text-azure" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        <FormattedMessage id="profile-views" defaultMessage="Profile Views" />
                                    </p>
                                    <p className="text-lg sm:text-2xl font-bold ">{insights.views}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="sm:w-full bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700">
                            <CardContent className="p-2 sm:p-4 flex items-center space-x-3">
                                <div className="p-2 bg-blue-400/20 rounded-lg">
                                    <UserPlus className="w-5 h-5 text-azure" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        <FormattedMessage id="new-connections" defaultMessage="New connections" />
                                    </p>
                                    <p className="text-lg sm:text-2xl font-bold ">{insights.connections}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Links Engagement */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold "><FormattedMessage id="links-engagement" defaultMessage="Links engagement" /></h2>

                    <div className="space-y-3">
                        {insights.links.map((link) => {
                            // const IconComponent = getLinkIcon(link.name)

                            return (
                                <Card key={link._id} className="bg-blue-200 dark:bg-navy border-slate-300 dark:border-slate-700 hover:bg-slate-750 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between gap-2 sm:gap-4">
                                        <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
                                            <div className="p-2 rounded-lg text-azure flex-shrink-0">
                                                <RenderIcon iconType={link.name} className="w-6 h-6" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-medium text-sm sm:text-base truncate">{link.title}</h3>
                                                <p className="text-sm text-gray-400 truncate">{link.link}</p>
                                            </div>
                                        </div>
                                        <div className="text-end flex-shrink-0 min-w-[60px]">
                                            <p className="text-lg font-semibold">{link.engagements}</p>
                                            <p className="text-sm text-gray-400">
                                                <FormattedMessage id="taps" defaultMessage="Taps" />
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div >
    )
}
