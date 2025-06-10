"use client"
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Eye, Share2 } from "lucide-react"
import { ProfileData } from "@/types/profile";

interface ProfileCarouselProps {
    profiles: ProfileData[] | []
}

export default function ProfileCarousel({ profiles }: ProfileCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    console.log("current :", current);

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
                        <CarouselItem key={profile._id} className={cn("basis-4/5 sm:basis-2/3 md:basis-1/2 xl:basis-1/3 ps-0", {})}>
                            <Card
                                className={cn(
                                    "transition-transform duration-500",
                                    index !== current - 1
                                        ? "scale-[0.8] basis-1/2 md:basis-[40%] xl:basis-[25%] opacity-70 pointer-events-none"
                                        : "scale-100 basis-2/3 md:basis-1/2 xl:basis-1/3 opacity-100"
                                )}
                            >

                                {/* Cover Section with Company Branding */}
                                <div className="relative h-24 xs:h-28 sm:h-32 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center rounded-t-lg">
                                    {/* Profile Image positioned over the cover */}
                                    <div className="absolute -bottom-10 sm:-bottom-12 start-3 xs:start-4 sm:start-6 rounded-full h-20 w-20 sm:h-24 sm:w-24 bg-red-500">
                                        {/* <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                                                <img
                                                    src={profile.profileImage || "/placeholder.svg?height=64&width=64"}
                                                    alt={profile.name}
                                                    className="object-cover"
                                                />
                                            </Avatar> */}
                                    </div>
                                </div>

                                {/* Profile Information */}
                                <CardContent className="pt-10 xs:pt-12 sm:pt-14 pb-2 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6 text-gray-800flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg xs:text-xl font-bold text-primary xs:mb-1">{profile.fullName}</h3>
                                        {profile.position && <p className="text-gray-600 text-sm font-medium xs:mb-1">{profile.position} at {profile.companyName}</p>}
                                    </div>

                                    {/* Action buttons at bottom */}
                                    <div className="flex justify-end">
                                        <button className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50">
                                            <Eye size={18} />
                                        </button>
                                        <button className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50">
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
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
            </div>
        </div>
    );
}
