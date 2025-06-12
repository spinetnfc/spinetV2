// app/add-profile/page.tsx
// import { getUserFromCookie } from '@/utils/cookie';
import { redirect } from 'next/navigation';
import AddProfileForm from '@/components/pages/profile/add-profile/add-profile-form';
// import { FormattedMessage } from 'react-intl';
import { getUserCookieOnServer } from '@/utils/server-cookie';

// Static data for form options
const LINK_TYPES = [
    'website', 'linkedin', 'instagram', 'twitter', 'github', 'email', 'phone',
    'facebook', 'location', 'order now', 'play store', 'app store', 'whatsapp',
    'telegram', 'viber', 'other',
];
const ROLE_OPTIONS = ['student', 'employee', 'professional', 'none'];

export default async function AddProfilePage() {
    const user = await getUserCookieOnServer();

    if (!user?._id) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen w-full items-center justify-center p-2 sm:p-4">
            {/* <h1 className="text-2xl font-bold mb-6">
                <FormattedMessage id="add-profile" />
            </h1> */}
            <AddProfileForm
                user={user}
                linkTypes={LINK_TYPES}
                roleOptions={ROLE_OPTIONS}
            />
        </div>
    );
}