import { urlBase, urlToken, client_credentials, urlAuthorize } from "@/config/base";
import { cookies } from 'next/headers';

export async function auth(username: string, password: string) {
    const formData = client_credentials('password', {
        username, password
    })
    const result = await fetch(urlToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData, // enviar como string codificado
        credentials: 'include',
    });
    return result;
}

export async function authorize() {
    const cookieStore = await cookies();
    const access = cookieStore.get('sso_session');

    if (!access) return true;
    
    const token = JSON.parse(access?.value ?? "");
    const dateToken = new Date(token.accessTokenExpiresAt);
    const currentDate = new Date();

    if(currentDate >= dateToken){

    }
    
    const data = await fetch(urlAuthorize, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.accessToken}`
        }
    });

    console.log(await data.json())
    if(data.status !== 200) return true;
    if(data.status === 200) return false;
}

