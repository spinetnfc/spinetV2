import { ReactNode } from 'react';

import SearchLayout from '@/components/layouts/search-layout';
import Footer from '@/components/pages/landing-page/footer/footer';

export const metadata = {
    title: 'Search - Spinet',
    description: 'Search',
};

const AppLayout = async ({
    params,
    children,
}: {
    params: Promise<{ locale: string }>;
    children: ReactNode;
}) => {
    const { locale } = await params;
    return (<>
        <SearchLayout locale={locale}>{children}</SearchLayout>
        <Footer locale={locale} />

    </>);
};

export default AppLayout;
