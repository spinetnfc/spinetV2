import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ContactAvatarProps {
  name: string
  profilePicture?: string
}

export default function ContactAvatar({ name, profilePicture }: ContactAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={profilePicture || "/placeholder.svg"} alt={name} />
      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">{initials}</AvatarFallback>
    </Avatar>
  )
}
