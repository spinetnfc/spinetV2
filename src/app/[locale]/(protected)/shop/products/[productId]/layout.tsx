import { ReactNode } from 'react';

import ProductLayout from '@/components/layouts/product-layout';

export const metadata = {
    title: 'Product',
    description: 'Product',
};

const AppLayout = async ({
    params,
    children,
}: {
    params: Promise<{ locale: string }>;
    children: ReactNode;
}) => {
    const { locale } = await params;
    return <ProductLayout locale={locale}>{children}</ProductLayout>;
};

export default AppLayout;
