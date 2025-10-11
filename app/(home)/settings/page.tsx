import Settings from "@/components/settings"
import { cookies } from 'next/headers';
import { getDetailsUser } from "@/lib/conexiones";

async function UserSettings() {
    const cookie = await cookies();
    const raw = cookie.get('sso_user')?.value ?? "{}";
    const user = JSON.parse(atob(raw)).userId;
    const session = cookie.get('sso_session')?.value ?? "";

    const details = await getDetailsUser(user, atob(session))
    return <Settings data={details.data} />
}

export default UserSettings;