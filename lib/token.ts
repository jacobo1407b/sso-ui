import { cookies } from 'next/headers';

export default async function getAccessToken(name: string): Promise<string> {
    const cookieStore = await cookies();
    const access = cookieStore.get(name)?.value ?? "";
    return access
}