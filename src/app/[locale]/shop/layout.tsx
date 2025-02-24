import { ReactNode } from 'react';

import ShopLayout from '@/components/layouts/shop-layout';

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
    return <ShopLayout locale={locale}>{children}</ShopLayout>;
};

export default AppLayout;
