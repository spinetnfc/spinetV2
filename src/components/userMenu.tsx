import { User2 } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import SwitchProfile from "@/components/switch-profile-drawer";
import { useEffect, useState } from "react";
import { getProfileAction } from "@/actions/profile";
import { getFile } from "@/actions/files";
import Image from "next/image";
const UserMenu = ({ locale }: { locale: string }) => {
    const { logout, user } = useAuth();
    const profileId = user?.selectedProfile || null;
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        let isMounted = true;
        async function fetchImage() {
            const profile = await getProfileAction(profileId);
            if (profile.profilePicture) {
                try {
                    const url = await getFile(profile.profilePicture);
                    if (isMounted) setImageUrl(url);
                } catch {
                    if (isMounted) console.log("coundlen't fetch profile image");

                }
            }
        }
        fetchImage();
    }, [profileId]);
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-background p-0">
                {imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={32} height={32} className="rounded-full object-cover" /> : <User2 className="size-6" />}
                <span className="sr-only">Open user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
                <SwitchProfile />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary cursor-pointer" onClick={logout}>
                <FormattedMessage id="logout" defaultMessage="Logout" />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default UserMenu;