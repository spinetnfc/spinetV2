import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/bottom-drawer"
import { getAllProfilesAction } from "@/actions/profile"
import { FormattedMessage } from "react-intl"
import { getUserFromCookie } from "@/utils/cookie";
import React, { startTransition, useEffect, useState, useRef } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";

export default function SwitchProfileDrawer() {
    const user = getUserFromCookie();
    const [profiles, setProfiles] = useState<any[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startTransition(async () => {
            const result = await getAllProfilesAction(user._id);
            setProfiles(result);
        });
    }, [user._id]);

    // Handle touch scrolling for horizontal scroll on mobile only
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Check if device is mobile/touch device
        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isMobile) return;

        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;

        const handleTouchStart = (e: TouchEvent) => {
            isScrolling = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Adjust scroll speed
            container.scrollLeft = scrollLeft - walk;
        };

        const handleTouchEnd = () => {
            isScrolling = false;
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <Drawer>
            <DrawerTrigger className="relative w-full flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
                <FormattedMessage id="switch-profile" defaultMessage="Switch Profile" />
            </DrawerTrigger>
            <DrawerContent className="overflow-x-hidden sm:overflow-x-scroll overflow-y-scroll sm:overflow-y-hidden">
                <DrawerHeader>
                    <DrawerTitle>
                        <FormattedMessage id="my-profiles" defaultMessage="My Profiles" />
                    </DrawerTitle>
                </DrawerHeader>
                <DrawerFooter>
                    {profiles.length > 0 ? (
                        <div
                            ref={scrollContainerRef}
                            className="flex flex-col sm:flex-row gap-4 mx-auto sm:px-4"
                            style={{
                                /* Enable smooth scrolling on mobile only */
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {profiles.map((profile) => (
                                <div key={profile._id}
                                    className={`w-60 flex flex-col items-center gap-4 py-4 rounded-lg border bg-card text-card-foreground shadow-sm ${user.selectedProfile === profile._id ? "border-2 border-azure" : ""
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
                        <Loader />
                    )}
                    {/* <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose> */}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}