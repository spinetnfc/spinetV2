import { getFile } from "@/actions/files"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ContactAvatarProps {
    name: string
    profilePicture?: string | null
    initials?: string | null
    size?: "sm" | "md" | "lg"
}

export default function ContactAvatar({ name, profilePicture, initials, size = "md" }: ContactAvatarProps) {
    // Determine size in pixels
    const sizeInPx = size === "sm" ? 32 : size === "md" ? 44 : 64
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        console.log("running getFile")
        async function fetchImage() {
            if (profilePicture) {
                const url = await getFile(profilePicture);
                console.log("Fetched image URL:", url);
                setImageUrl(url);
            }
        }
        fetchImage();
    }, [profilePicture]);
    // Generate initials if not provided
    const displayInitials =
        initials ||
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()

    if (imageUrl?.startsWith('http')) {
        return (
            <Image
                src={imageUrl}
                alt={name}
                width={sizeInPx}
                height={sizeInPx}
                className="object-cover rounded-md aspect-square w-10 sm:w-14 min-w-10 sm:min-w-14"
            />
        );
    }

    return (
        <div
            className="rounded-md flex items-center justify-center text-white bg-azure font-light
             sm:text-lg aspect-square w-10 sm:w-14 min-w-10 sm:min-w-14"
        >
            {displayInitials}
        </div>
    )
}
