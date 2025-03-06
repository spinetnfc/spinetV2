import { ReactNode } from 'react';

import SearchLayout from '@/components/layouts/search-layout';

export const metadata = {
    title: 'Search',
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
    return <SearchLayout locale={locale}>{children}</SearchLayout>;
};

export default AppLayout;
