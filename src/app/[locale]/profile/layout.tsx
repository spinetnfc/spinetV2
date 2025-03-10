import { ReactNode } from 'react';

import ProfileLayout from '@/components/layouts/profile-layout';

export const metadata = {
    title: 'Shop',
    description: 'Shop',
};

const AppLayout = async ({
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

export default AppLayout;
