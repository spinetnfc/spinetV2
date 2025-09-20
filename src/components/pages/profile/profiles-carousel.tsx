"use client";
import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/utils/cn';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { CirclePlus, Eye, Share2, UserRoundPen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { FormattedMessage } from "react-intl";
import { useIsSidebarExpanded } from "@/lib/store/sidebar-store";
import { ProfileData } from "@/types/profile";

interface ProfileCarouselProps {
    profiles: ProfileData[];
}

export default function ProfileCarousel({ profiles }: ProfileCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const pathname = usePathname();
    const router = useRouter();
    const isExpanded = useIsSidebarExpanded();

    React.useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
    }, [api]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <Carousel
                setApi={setApi}
                className={`${isExpanded
                    ? "w-full max-w-screen lg:max-w-[calc(100vw-240px)]"
                    : "max-w-screen lg:max-w-[calc(100vw-64px)]"
                    } overflow-hidden`}
                opts={{ containScroll: false }}
            >
                <CarouselContent className="py-3 -ms-0">
                    {profiles.map((profile, index) => (
                        <ProfileCard
                            key={profile._id}
                            profile={profile}
                            index={index}
                            current={current}
                            pathname={pathname}
                            router={router}
                        />
                    ))}

                    {/* Add Profile */}
                    <CarouselItem
                        key="add-profile"
                        className="basis-4/5 sm:basis-2/3 md:basis-1/2 2xl:basis-1/3 flex w-full items-end"
                    >
                        <Card
                            className={cn(
                                "flex-1 flex items-center justify-center h-60 xs:h-64 sm:h-74 transition-transform duration-500",
                                current === profiles.length + 1
                                    ? "scale-100 opacity-100"
                                    : "scale-[0.8] opacity-70 pointer-events-none"
                            )}
                        >
                            <button
                                className="flex flex-col items-center justify-center w-full h-full py-8 text-primary hover:text-blue-700 transition-colors cursor-pointer"
                                onClick={() => router.push(`${pathname}/profile/add-profile`)}
                            >
                                <CirclePlus className="h-24 w-24" strokeWidth={1} />
                                <span className="mt-2 font-medium">
                                    <FormattedMessage id="add-profile" defaultMessage="Add Profile" />
                                </span>
                            </button>
                        </Card>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>

            {/* Dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
                {profiles.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            "h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-primary cursor-pointer",
                            { "scale-150": current === index + 1 }
                        )}
                    />
                ))}
                <button
                    key={profiles.length}
                    onClick={() => api?.scrollTo(profiles.length)}
                    className={cn(
                        "h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-primary cursor-pointer",
                        { "scale-150": current === profiles.length + 1 }
                    )}
                />
            </div>
        </div>
    );
}

// ProfileCard handles fetching its own images
function ProfileCard({
    profile,
    index,
    current,
    pathname,
    router,
}: {
    profile: ProfileData;
    index: number;
    current: number;
    pathname: string;
    router: ReturnType<typeof useRouter>;
}) {
    const [pictureUrl, setPictureUrl] = React.useState<string>("/img/user.png");
    const [coverUrl, setCoverUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchImages() {
            if (profile.profilePicture) {
                try {
                    // Mock file URL - replace with hardcoded behavior
                    const url = "/img/user.png";
                    setPictureUrl(url);
                } catch {
                    setPictureUrl("/img/user.png");
                }
            }

            if (profile.profileCover) {
                try {
                    // Mock cover URL - replace with hardcoded behavior  
                    const url = "/img/abstract.jpeg";
                    setCoverUrl(url);
                } catch {
                    setCoverUrl(null);
                }
            }
        }
        fetchImages();
    }, [profile.profilePicture, profile.profileCover]);

    return (
        <CarouselItem
            className={cn("basis-4/5 sm:basis-2/3 md:basis-1/2 2xl:basis-1/3")}
        >
            <div>
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://spinettest.vercel.app/public-profile/${profile._id}`}
                    alt="qr code"
                    className={cn(
                        "mx-auto transition-transform duration-500 border-4 border-primary rounded-sm mb-6",
                        index !== current - 1 ? "scale-0" : ""
                    )}
                />

                <Card
                    className={cn(
                        "transition-transform duration-500",
                        index !== current - 1
                            ? "scale-[0.8] opacity-70 pointer-events-none"
                            : "scale-100 opacity-100"
                    )}
                >
                    {/* Cover */}
                    <div
                        className={cn(
                            "relative h-24 xs:h-28 sm:h-32 flex items-center justify-center rounded-t-lg",
                            !coverUrl && "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800"
                        )}
                        style={
                            coverUrl
                                ? {
                                    backgroundImage: `url(${coverUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }
                                : undefined
                        }
                    >
                        {/* Profile image */}
                        <div className="absolute -bottom-10 sm:-bottom-12 start-3 xs:start-4 sm:start-6 rounded-full border-2 border-white h-20 w-20 sm:h-24 sm:w-24 bg-white overflow-hidden">
                            <Image
                                src={pictureUrl}
                                alt="profile image"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="pt-10 h-36 sm:h-42 xs:pt-12 sm:pt-14 pb-2 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6 text-gray-800 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg xs:text-xl font-bold text-primary xs:mb-1">
                                {profile.fullName}
                            </h3>
                            {profile.status === "student" ? (
                                <>
                                    <FormattedMessage id="student" /> <FormattedMessage id="at" /> {profile.school}
                                </>
                            ) : profile.status === "employee" ? (
                                <>
                                    {profile.position} <FormattedMessage id="at" /> {profile.companyName}
                                </>
                            ) : profile.status === "professional" ? (
                                profile.profession
                            ) : null}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end items-end">
                            <Link
                                href={`${pathname}/profile`}
                                className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50"
                            >
                                <Eye size={18} />
                            </Link>
                            <Link
                                href={`${pathname}/profile/update-info`}
                                className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50"
                            >
                                <UserRoundPen size={18} />
                            </Link>
                            <button
                                className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50 cursor-pointer"
                                onClick={() => {
                                    const link = `https://spinettest.vercel.app/public-profile/${profile._id}`;
                                    navigator.clipboard.writeText(link);
                                    toast.success("Profile link copied to clipboard!", {
                                        duration: 2000,
                                    });
                                }}
                                title="Copy profile link"
                            >
                                <Share2 size={18} />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CarouselItem>
    );
}
