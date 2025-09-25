import Image from "next/image"
import { useEffect, useState } from "react"

interface ContactAvatarProps {
    name: string
    profilePicture?: string | null
    initials?: string | null
}

export default function ContactAvatar({ name, profilePicture, initials }: ContactAvatarProps) {
    // Determine size in pixels
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        async function fetchImage() {
            if (profilePicture) {
                // Mock implementation - just use the profilePicture as URL if it looks like one
                if (profilePicture.startsWith('http') || profilePicture.startsWith('/')) {
                    setImageUrl(profilePicture);
                } else {
                    // For non-URL strings, use a placeholder or generate a mock URL
                    setImageUrl(`/img/user.png`); // fallback image
                }
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
                width={32}
                height={32}
                className="object-cover rounded-md aspect-square w-10 min-w-10 "
            />
        );
    }

    return (
        <div
            className="rounded-md flex items-center justify-center text-white bg-azure font-light
              aspect-square w-10 min-w-10 "
        >
            {displayInitials}
        </div>
    )
}
