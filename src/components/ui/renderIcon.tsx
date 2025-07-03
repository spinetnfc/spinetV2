import {
    Linkedin,
    Globe,
    Phone,
    Facebook,
    Instagram,
    Youtube,
    Mail,
    Twitter,
    Store,
    MapPinned,
    Github,
} from "lucide-react"
import PlayStoreIcon from "@/components/icons/play-store"
import AppStoreIcon from "@/components/icons/app-store"
import Whatsapp from "@/components/icons/whatsapp"
import Telegram from "@/components/icons/telegram"
import Viber from "@/components/icons/viber"
import Tiktok from "@/components/icons/tiktok"

interface RenderIconProps {
    iconType: string;
    className?: string;
}

export function RenderIcon({ iconType, className = "w-5 h-5 text-azure" }: RenderIconProps) {
    switch (iconType.toLowerCase()) {
        case "linkedin":
            return <Linkedin className={className} />
        case "facebook":
            return <Facebook className={className} />
        case "instagram":
            return <Instagram className={className} />
        case "youtube":
            return <Youtube className={className} />
        case "twitter":
            return <Twitter className={className} />
        case "email":
            return <Mail className={className} />
        case "phone":
            return <Phone className={className} />
        case "Phone Number":
            return <Phone className={className} />
        case "PhoneNumber":
            return <Phone className={className} />
        case "github":
            return <Github className={className} />
        case "playstore":
            return <PlayStoreIcon className={className} />
        case "appstore":
            return <AppStoreIcon className={className} />
        case "store":
            return <Store className={className} />
        case "location":
            return <MapPinned className={className} />
        case "whatsapp":
            return <Whatsapp className={className} />
        case "telegram":
            return <Telegram className={className} />
        case "viber":
            return <Viber className={className} />
        case "tiktok":
            return <Tiktok className={className} />
        case "globe":
        default:
            return <Globe className={className} />
    }
}