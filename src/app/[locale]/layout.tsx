// import { Metadata } from 'next';
import { ReactNode } from 'react';
import { AppProvider } from '@/app/[locale]/provider';
import '@/styles/globals.css';
// getIntl;
import { getDirection } from '@/lib/intl';
import { Poppins, Inter, Cairo } from 'next/font/google'
// If you need to generate metadata, you can uncomment and adjust the code below.
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
const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});
const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const arabic = Cairo({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
});

const RootLayout = async ({
  params,
  children,
}: {
  params: { locale: string };
  children: ReactNode;
}) => {
  // Await params (without calling it as a function)
  // Ensure locale is always a string
  const locale = params.locale ?? "en";
  const dir = getDirection(locale);
  const fontClass = locale === 'ar' ? arabic.variable : poppins.variable;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={`${fontClass} scroll-smooth ${locale === 'ar' ? 'ar' : ''}`}>
      <title>Spinet NFC</title>
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
