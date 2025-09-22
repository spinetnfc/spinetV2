// import { Metadata } from 'next';
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { AppProvider } from '@/app/[locale]/provider';
import '@/styles/globals.css';
// getIntl;
import { getDirection } from '@/lib/intl';
import { Poppins, Inter, Cairo } from 'next/font/google'

// Define supported locales
const locales = ['en', 'fr', 'ar'];

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

const RootLayout = async (
  props: {
    params: Promise<{ locale: string }>;
    children: ReactNode;
  }
) => {
  const params = await props.params;

  const {
    children
  } = props;

  // Await params (without calling it as a function)
  // Ensure locale is always a string
  const locale = params.locale ?? "en";

  // Validate locale - trigger 404 if invalid
  if (!locales.includes(locale)) {
    notFound();
  }

  const dir = getDirection(locale);
  const fontClass = locale === 'ar' ? arabic.variable : poppins.variable;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={`${fontClass}   ${locale === 'ar' ? 'ar' : ''}`}>
      <title>Spinet NFC</title>
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
