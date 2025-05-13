import { Link, User2 } from "lucide-react";
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
const UserMenu = ({ locale }: { locale: string }) => {
    const router = useRouter();
    const { logout } = useAuth();
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-background">
                <User2 className="size-6" />
                <span className="sr-only">Open user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuItem className="text-primary cursor-pointer" onClick={() => router.push(`/${locale}/profile`)}>
                <FormattedMessage id="profile" defaultMessage="Profile" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary cursor-pointer" onClick={() => router.push(`/${locale}/contacts`)}>
                <FormattedMessage id="contacts" defaultMessage="Contacts" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary cursor-pointer" onClick={logout}>
                <FormattedMessage id="logout" defaultMessage="Logout" />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default UserMenu;