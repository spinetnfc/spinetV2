import { getServerSession, getLocaleFromCookies } from '@/lib/auth/server';
import { AuthProvider } from '@/context/authContext';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();
    const locale = await getLocaleFromCookies();

    if (!session) {
        redirect(`/${locale}/auth/login`);
    }

    return (
        <AuthProvider initialUser={session.user}>
            {children}
        </AuthProvider>
    );
}