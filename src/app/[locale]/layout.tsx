// import { Metadata } from 'next';
import { ReactNode } from 'react';

import { AppProvider } from '@/app/[locale]/provider';
import '@/styles/globals.css';
// getIntl;
import { getDirection } from '@/lib/intl';

// type RouteProps = {
//   params: { locale: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

// export async function generateMetadata(props: RouteProps): Promise<Metadata> {
//   const intl = await getIntl(props.params.locale);
//   return {
//     title: intl.formatMessage({ id: 'page.home.head.title' }),
//     description: intl.formatMessage({ id: 'page.home.head.meta.description' }),
//     alternates: {
//       canonical: 'https://example.com',
//       languages: {
//         ar: 'http://example.com/ar',
//         en: 'http://example.com',
//         fr: 'http://example.com/fr',
//         'x-default': 'http://example.com',
//       },
//     },
//   };
// }

const RootLayout = ({
  params,
  children,
}: {
  params: { locale: string };
  children: ReactNode;
}) => {
  const { locale } = params;
  const dir = getDirection(locale);
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>{' '}
      </body>
    </html>
  );
};

export default RootLayout;
