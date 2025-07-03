import { getFile } from "@/actions/files";
import Image from "next/image";
import { useEffect, useState } from "react";
import avatar from "@/assets/images/user.png";

interface ProfileAvatarProps {
    profilePicture?: string | null;
    profileCover?: string | null;
    alt?: string;
    width?: number;
    height?: number;
}

export function ProfileAvatar({
    profilePicture,
    profileCover,
    alt = "Profile Picture",
    width = 40,
    height = 40,
}: ProfileAvatarProps) {
    const [imageUrl, setImageUrl] = useState<string>(avatar.src);

    useEffect(() => {
        let isMounted = true;
        async function fetchImage() {
            if (profileCover) {
                try {
                    const url = await getFile(profileCover);
                    if (isMounted) setImageUrl(url);
                } catch {
                    if (isMounted) setImageUrl(avatar.src);
                }
            } else if (profilePicture) {
                try {
                    const url = await getFile(profilePicture);
                    if (isMounted) setImageUrl(url);
                } catch {
                    if (isMounted) setImageUrl(avatar.src);
                }
            } else {
                setImageUrl(avatar.src)
            }
        }
        fetchImage();
        return () => {
            isMounted = false;
        };
    }, [profilePicture, profileCover]);

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={profileCover ? undefined : width}
            height={profileCover ? undefined : height}
            className={profileCover ? "w-full h-full object-cover" : "rounded-full object-cover"}
            priority
            fill={profileCover ? true : false}
        />
    );
}