import Settings from "@/components/settings"
import { cookies } from 'next/headers';
import { api } from "@/lib/api";


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración - SSO',
};


async function UserSettings() {
    const cookie = await cookies();
    
    const raw = cookie.get('sso_user')?.value ?? "{}";
    const user = JSON.parse(atob(raw)).userId;
    const session = cookie.get('sso_session')?.value ?? "";
    
    const user_id = user ?? JSON.parse(atob(raw)).user_id
    const details = await api.users.getSession(user_id, atob(session));
    return <Settings data={details.data} />
}

export default UserSettings;