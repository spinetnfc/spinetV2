"use client"
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CirclePlus, Eye, Share2, UserRoundPen } from "lucide-react"
import { ProfileData } from "@/types/profile";
import Link from "next/link";
import Image from "next/image";
import { toast } from 'sonner';
import { usePathname, useRouter } from "next/navigation";
import { FormattedMessage } from "react-intl";

interface ProfileCarouselProps {
    profiles: ProfileData[] | []
}

export default function ProfileCarousel({ profiles }: ProfileCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const pathname = usePathname();
    const router = useRouter();
    React.useEffect(() => {
        if (!api) {
            return;
        }
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div className="w-full">
            <Carousel
                setApi={setApi}
                className="w-full max-w-screen overflow-hidden"
                opts={{ loop: true }}
            >
                <CarouselContent className="py-3 -ms-0">
                    {profiles.map((profile, index) => (
                        <CarouselItem key={profile._id} className={cn("basis-4/5 sm:basis-2/3 md:basis-1/2 2xl:basis-1/3 ps-0", {})}>
                            <div>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://spinettest.vercel.app/public-profile/${profile._id}`}
                                    alt="qr code"
                                    className={cn(
                                        "mx-auto transition-transform duration-500 border-4 border-primary rounded-sm mb-6",
                                        index !== current - 1
                                            ? " scale-0"
                                            : ""
                                    )}
                                />
                                <Card
                                    className={cn(
                                        "transition-transform duration-500",
                                        index !== current - 1
                                            ? "scale-[0.8] basis-1/2 md:basis-[40%] 2xl:basis-[25%] opacity-70 pointer-events-none"
                                            : "scale-100 basis-2/3 md:basis-1/2 2xl:basis-1/3 opacity-100"
                                    )}
                                >

                                    {/* Cover Section with Company Branding */}
                                    <div className="relative h-24 xs:h-28 sm:h-32 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center rounded-t-lg">
                                        {/* Profile Image positioned over the cover */}
                                        <div className="absolute -bottom-10 sm:-bottom-12 start-3 xs:start-4 sm:start-6 rounded-full h-20 w-20 sm:h-24 sm:w-24 bg-white">
                                            <Image
                                                src="/img/user.png"
                                                fill
                                                alt="profile image"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Profile Information */}
                                    <CardContent className="pt-10 h-36 sm:h-42 xs:pt-12 sm:pt-14 pb-2 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6 text-gray-800flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg xs:text-xl font-bold text-primary xs:mb-1">{profile.fullName}</h3>
                                            {profile.position && <p className="text-gray-600 text-sm font-medium xs:mb-1">{profile.position} <FormattedMessage id="at" /> {profile.companyName}</p>}
                                        </div>

                                        {/* Action buttons at bottom */}
                                        <div className="flex justify-end items-end">
                                            <Link
                                                href={`${pathname}/profile`}
                                                className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`${pathname}/profile/update-info`} className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50">
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
                    ))}
                    <CarouselItem key="add-profile" className={cn("basis-4/5 sm:basis-2/3 md:basis-1/2 2xl:basis-1/3 ps-0", "flex w-full items-end")}>
                        <Card
                            className={cn(
                                "flex-1 flex items-center justify-center h-60 xs:h-64 sm:h-74 transition-transform duration-500",
                                current === profiles.length + 1
                                    ? "scale-100 basis-2/3 md:basis-1/2 2xl:basis-1/3 opacity-100"
                                    : "scale-[0.8] basis-1/2 md:basis-[40%] 2xl:basis-[25%] opacity-70 pointer-events-none"
                            )}
                        >
                            <button
                                className="flex flex-col items-center justify-center w-full h-full py-8 text-primary hover:text-blue-700 transition-colors cursor-pointer"
                                onClick={() => {
                                    // Replace with your add profile logic or navigation
                                    router.push(`${pathname}/profile/add-profile`);
                                }}
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
            <div className="mt-4 flex items-center justify-center gap-2">
                {profiles.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn("h-2.5 w-2.5 rounded-full bg-primary cursor-pointer", {
                            " scale-150": current === index + 1,
                        })}
                    />
                ))}
                <button
                    key={profiles.length}
                    onClick={() => api?.scrollTo(profiles.length)}
                    className={cn("h-2.5 w-2.5 rounded-full bg-primary cursor-pointer", {
                        " scale-150": current === profiles.length + 1,
                    })}
                />
            </div>
        </div >
    );
}
