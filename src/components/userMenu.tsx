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
import { useUser } from "@/lib/store/auth/auth-store";
// TODO: useLogout will be moved to ViewModel when implemented
import SwitchProfile from "@/components/switch-profile-drawer";
import { useEffect, useState } from "react";
import { useProfileStore } from "@/lib/store/profile-store";

import { ProfileAvatar } from "./pages/profile/profile-avatar";
const UserMenu = ({ locale }: { locale: string }) => {
    // const logout = useLogout(); // TODO: Will be handled by ViewModel
    const user = useUser();
    const getProfileData = useProfileStore((state) => state.fetchProfile);
    const profileId = user?.selectedProfile || null;
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        let isMounted = true;
        async function fetchImage() {
            if (profileId) {
                try {
                    const profile = await getProfileData(profileId);
                    if (profile?.profilePicture && isMounted) {
                        setImageUrl(profile.profilePicture);
                    }
                } catch (error) {
                    console.error('Failed to fetch profile image:', error);
                }
            }
        }
        fetchImage();
        return () => { isMounted = false; };
    }, [profileId, getProfileData]);
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-background p-0">
                {imageUrl ? <ProfileAvatar profilePicture={imageUrl} /> : <User2 className="size-6" />}
                <span className="sr-only">Open user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
                <SwitchProfile />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary cursor-pointer" onClick={() => {
                // TODO: Implement logout via ViewModel
                console.log('Logout clicked - will be handled by ViewModel');
            }}>
                <FormattedMessage id="logout" defaultMessage="Logout" />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default UserMenu;