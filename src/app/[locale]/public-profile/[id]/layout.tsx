import { ReactNode } from 'react';

import ProfileLayout from '@/components/layouts/public-profile-layout';

export const metadata = {
    title: 'Public Profile - Spinet',
    description: 'View other users public profile',
};

const PublicProfileLayout = async ({
    params,
    children,
}: {
    params: Promise<{ locale: string }>;
    children: ReactNode;
}) => {
    const { locale } = await params;
    return (
        <>
            <ProfileLayout locale={locale}>
                {children}
            </ProfileLayout>
        </>
    )
};

export default PublicProfileLayout;
