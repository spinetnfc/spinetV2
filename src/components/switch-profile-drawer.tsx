"use client"

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/bottom-drawer"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getAllProfilesAction } from "@/actions/profile"
import { FormattedMessage } from "react-intl"
import { getUserFromCookie } from "@/utils/cookie"
import { startTransition, useEffect, useState } from "react"
import { Loader } from "lucide-react"
import Image from "next/image"

export default function SwitchProfileDrawer() {
    const user = getUserFromCookie()
    const [profiles, setProfiles] = useState<any[]>([])

    useEffect(() => {
        startTransition(async () => {
            const result = await getAllProfilesAction(user._id)
            setProfiles(result)
        })
    }, [user._id])

    return (
        <Drawer>
            <DrawerTrigger className="relative w-full flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
                <FormattedMessage id="switch-profile" defaultMessage="Switch Profile" />
            </DrawerTrigger>
            <DrawerContent className="focus:outline-none">
                <DrawerHeader>
                    <DrawerTitle>
                        <FormattedMessage id="my-profiles" defaultMessage="My Profiles" />
                    </DrawerTitle>
                </DrawerHeader>
                <DrawerFooter className="sm:justify-start">
                    <ScrollArea className="w-full h-[300px] px-1">
                        {profiles.length > 0 ? (
                            <div className="flex flex-col items-center sm:flex-row gap-4 pb-4">
                                {profiles.map((profile) => (
                                    <div
                                        key={profile._id}
                                        className={`flex-shrink-0 min-h-60 w-60 flex flex-col items-center gap-4 p-2 rounded-lg border bg-card text-card-foreground shadow-sm ${user.selectedProfile === profile._id ? "border-2 border-azure" : ""
                                            }`}
                                    >
                                        <Image
                                            src="/img/user.png"
                                            alt="profile image"
                                            className="w-24 h-24 rounded-full"
                                            width={60}
                                            height={60}
                                        />
                                        <div>
                                            <div className="font-semibold">{profile.fullName}</div>
                                            <div className="text-sm text-muted-foreground">{profile.companyName}</div>
                                            <div className="text-xs text-muted-foreground">{profile.position}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <Loader className="animate-spin" />
                            </div>
                        )}
                        <ScrollBar orientation="horizontal" className="hidden sm:block" />
                    </ScrollArea>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
