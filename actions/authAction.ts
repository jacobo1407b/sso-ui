'use server';
import { flows } from "@/config/base";
import { cookies, headers } from 'next/headers';

const context = {}


export async function loginAction(username: string, password: string) {
    const hdrs = await headers();
    const cook = await cookies();
    const forwardedFor = hdrs.get('x-forwarded-for');

    const context = {
        userAgent: hdrs.get('user-agent') ?? 'Desconocido',
        ip: forwardedFor?.split(',')[0]?.trim() ?? 'IP no disponible',
        username,
        password
    }
    const resp = await flows.getJsonToken(context);

    if (resp.status === 200) {
        cook.set('sso_session', btoa(resp.token_id), {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        })
        cook.set('sso_user', btoa(JSON.stringify(resp.user)), {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        })
        cook.set('sso_token', resp.accessToken, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
        cook.set('sso_refresh', resp.refreshToken, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
        cook.set('sso_refresh_expired', resp.refreshTokenExpiresAt, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
        cook.set('sso_token_expired', resp.accessTokenExpiresAt, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
    }
    
    return {
        status:200,
        ...resp
    }
}

export async function refreshMfa() {
    const cookieStore = await cookies();
    const headerStore = await headers();

    const refresh_toke = cookieStore.get('sso_refresh')?.value ?? "";
    const agent = headerStore.get("user-agent") ?? "Desconocido";
    const ip = headerStore.get("x-forwarded-for") ?? "0";

    const result = await flows.RefreshToken({
        refresh_token: refresh_toke,
        ip,
        userAgent: agent
    });

    console.log(result)
    cookieStore.set('sso_token', result.accessToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('sso_user', btoa(JSON.stringify(result.user)), {
        path: '/',
        httpOnly: true,
        secure: false, // ← solo en local
        sameSite: 'lax', // ← más permisivo
        maxAge: 60 * 60 * 24 * 7
    })
    cookieStore.set("sso_token_expired", result.accessTokenExpiresAt, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("sso_refresh", result.refreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("sso_refresh_expired", result.refreshTokenExpiresAt, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("sso_session", btoa(result.token_id), {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });
    return result
}

export async function AutorizeAction(client: string, state: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("sso_token")?.value ?? "";
    return await flows.GetAuthorizationCode({
        client_id: client,
        state
    }, token);
}