// import { cookies } from 'next/headers';

// export default async function DebugPage() {
//     const cookieStore = await cookies();
//     const session = cookieStore.get('spinet-session')?.value;

//     return (
//         <pre>
//             {JSON.stringify({ session }, null, 2)}
//         </pre>
//     );
// }

'use client';

import { useEffect, useState } from 'react';
import { getUserFromCookie } from '@/utils/cookies';
import { getContacts } from '@/lib/api/contacts';
import type { Contact } from '@/types/contact';

const Contacts = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    function getUserFromCookie() {
        const cookieString = document.cookie
            .split('; ')
            .find(row => row.startsWith('current-user='));
        if (!cookieString) return null;

        try {
            const json = decodeURIComponent(cookieString.split('=')[1]);
            return JSON.parse(json);
        } catch (err) {
            console.error('Failed to parse user cookie:', err);
            return null;
        }
    }
    useEffect(() => {
        const fetchContacts = async () => {
            const user = await getUserFromCookie(); // assume it's async
            const profileId = user?.selectedProfile || '1';
            try {
                const data = await getContacts(profileId);
                setContacts(data);
            } catch (err) {
                console.error('Failed to load contacts', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading contacts...</p>
            ) : (
                <pre>{JSON.stringify(contacts, null, 2)}</pre>
            )}
        </div>
    );
};

export default Contacts;
