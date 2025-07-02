import { getFile } from "@/actions/files";
import Image from "next/image";
import { useEffect, useState } from "react";
import avatar from "@/assets/images/user.png";

export function ProfileAvatar({ profilePicture, alt }: { profilePicture?: string | null, alt: string }) {
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
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border border-white"
            unoptimized
        />
    );
}
