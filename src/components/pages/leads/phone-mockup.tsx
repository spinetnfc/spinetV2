import React from "react";
import { cn } from "@/utils/cn";
import type { Contact } from "@/types/contact";
import { X } from "lucide-react";
import { ProfileAvatar } from "../profile/profile-avatar";
import { RenderIcon } from "@/components/ui/renderIcon";

interface PhoneMockupProps {
    data: Contact["Profile"];
    className?: string;
    onClose?: () => void;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ data, className, onClose }) => {
    if (!data) {
        return (
            <div className="inline-flex min-w-fit max-w-[290px] animate-pulse flex-col items-center justify-center overflow-y-auto rounded-3xl border-6 bg-background border-gray-300 dark:bg-background-dark-80">
                <div className="flex h-full w-full flex-col justify-center">
                    {/* Loading spinner placeholder */}
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-azure rounded-full animate-spin mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "inline-flex h-full min-w-[290px] max-w-[290px] flex-col items-center overflow-y-auto rounded-3xl shadow pb-20 border-6 bg-background border-gray-300",
                className,
            )}
        >
            <div className="relative h-[120px] min-h-[120px] w-full cursor-pointer">
                <ProfileAvatar profileCover={data.profileCover} />

                <div className="absolute -bottom-12 inline-flex h-fit w-full cursor-pointer flex-col items-center">
                    <div className="relative inline-flex h-[90px] flex-col items-center">
                        <ProfileAvatar profilePicture={data.profilePicture} height={80} width={80} />
                        {/* {data.logo && (
                                <img
                                    src={data.logo}
                                    alt="logo"
                                    className="absolute bottom-0 m-0 h-[30px] w-[30px] rounded-sm object-cover p-0"
                                />
                            )} */}
                    </div>
                </div>
            </div>
            <div className="h-8" />
            <p className="my-2 text-md font-semibold">
                {data.fullName || `${data.firstName || ""} ${data.lastName || ""}`}
            </p>
            <div className="m-0 flex space-x-1 text-center text-sm font-semibold text-neutral-30">
                <div>
                    {data.position} {data.companyName ? "at" : null} {data.companyName}
                </div>
                {/* Badge if needed */}
            </div>
            <p className="m-0 text-center text-xs font-semibold text-neutral-30">
                {data.bio}
            </p>
            {/* Links section placeholder */}
            <p className="my-2 w-[95%] text-sm font-semibold">Personal Links</p>
            <div className="grid w-[95%] grid-cols-2 gap-3">
                {data?.links?.map((link: any, index: number) => (
                    <div
                        key={index}
                        className="w-full cursor-pointer rounded-md duration-300 hover:shadow-md bg-gray-100 dark:bg-navy"
                        onClick={() => window.open(link.link, "_blank")}
                    >
                        <div className="flex justify-between">
                            <div className="relative m-2 flex h-5 w-5 min-w-5 flex-col justify-center">
                                <RenderIcon iconType={link.name ? link.name : link.title} />

                            </div>
                        </div>
                        <p className="mx-2 max-w-full truncate text-sm font-bold">{link.title}</p>
                        <p className="mx-2 mb-1 max-w-full truncate text-xs font-medium text-neutral-60">{link.link}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhoneMockup; 