import Image from "next/image"

interface ContactAvatarProps {
    name: string
    profilePicture?: string | null
    initials?: string | null
    size?: "sm" | "md" | "lg"
}

export default function ContactAvatar({ name, profilePicture, initials, size = "md" }: ContactAvatarProps) {
    // Determine size in pixels
    const sizeInPx = size === "sm" ? 32 : size === "md" ? 44 : 64

    // Generate initials if not provided
    const displayInitials =
        initials ||
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()

    if (profilePicture) {
        return (
            <div className="rounded-md overflow-hidden aspect-square w-10 sm:w-14 min-w-10 sm:min-w-14">
                <Image
                    src={profilePicture || "/placeholder.svg"}
                    alt={name}
                    width={sizeInPx}
                    height={sizeInPx}
                    className="object-cover"
                />
            </div>
        )
    }

    return (
        <div
            className="rounded-md flex items-center justify-center text-white bg-azure font-light
             sm:text-lg aspect-square w-10 min-w-10"
        >
            {displayInitials}
        </div>
    )
}
