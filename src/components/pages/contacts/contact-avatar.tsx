import Image from "next/image"

interface ContactAvatarProps {
    name: string
    profilePicture?: string | null
    initials?: string | null
    color: string
    size?: "sm" | "md" | "lg"
}

export default function ContactAvatar({ name, profilePicture, initials, color, size = "md" }: ContactAvatarProps) {
    // Determine size in pixels
    const sizeInPx = size === "sm" ? 40 : size === "md" ? 56 : 72

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
            <div className={`rounded-md overflow-hidden min-w-[${sizeInPx}px]`} style={{ width: sizeInPx, height: sizeInPx }}>
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
            className={`rounded-md flex items-center justify-center text-white font-medium min-w-[${sizeInPx}px]`}
            style={{
                width: sizeInPx,
                height: sizeInPx,
                backgroundColor: color,
                fontSize: size === "sm" ? "16px" : size === "md" ? "20px" : "24px",
            }}
        >
            {displayInitials}
        </div>
    )
}
