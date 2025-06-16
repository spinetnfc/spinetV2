import SettingsPage from "@/components/pages/settings/settings-page";
import { getUserCookieOnServer } from "@/utils/server-cookie";

export default function Page() {
    const user = getUserCookieOnServer();
    return <SettingsPage user={user} />
}
