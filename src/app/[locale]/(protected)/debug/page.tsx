import { cookies } from 'next/headers';

export default async function DebugPage() {
    const cookieStore = await cookies(); // ✅ now correctly awaited
    const session = cookieStore.get('spinet-session')?.value;

    return (
        <pre>
            {JSON.stringify({ session }, null, 2)}
        </pre>
    );
}
