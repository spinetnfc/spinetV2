
import { getFile } from "@/actions/files";
import Image from "next/image";
import { useEffect, useState } from "react";
import avatar from "@/assets/images/user.png";

interface ProfileAvatarProps {
    profilePicture?: string | null;
    alt?: string;
    width?: number;
    height?: number;
}

export function ProfileAvatar({
    profilePicture,
    alt = "Profile Picture",
    width = 40,
    height = 40,
}: ProfileAvatarProps) {
    const [imageUrl, setImageUrl] = useState<string>(avatar.src);

    useEffect(() => {
        let isMounted = true;
        async function fetchImage() {
            if (profilePicture) {
                try {
                    const url = await getFile(profilePicture);
                    if (isMounted) setImageUrl(url);
                } catch {
                    if (isMounted) setImageUrl(avatar.src);
                }
            } else {
                setImageUrl(avatar.src);
            }
        }
        fetchImage();
        return () => {
            isMounted = false;
        };
    }, [profilePicture]);

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className="rounded-full object-cover border border-white"
            priority
        />
    );
}
