'use server';

import { cookies, headers } from 'next/headers';
import { auth, refreshToken } from '@/lib/conexiones';

export async function loginAction(username: string, password: string) {
    const hdrs = await headers();
    const cook = await cookies();
    const userAgent = hdrs.get('user-agent') ?? 'Desconocido';
    const forwardedFor = hdrs.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() ?? 'IP no disponible';

    const resp = await auth(username, password, ip, userAgent);
    const data = await resp.json();

    if (resp.status === 200) {
        cook.set('sso_session', btoa(data.token_id), {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        })
        cook.set('sso_user', btoa(JSON.stringify(data.user)), {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        })
        cook.set('sso_token', data.accessToken, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
        cook.set('sso_refresh', data.refreshToken, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
        cook.set('sso_refresh_expired', data.refreshTokenExpiresAt, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
        cook.set('sso_token_expired', data.accessTokenExpiresAt, {
            path: '/',
            httpOnly: true,
            secure: false, // ← solo en local
            sameSite: 'lax', // ← más permisivo
            maxAge: 60 * 60 * 24 * 7
        });
    }
    return data;
}

export async function refreshMfa() {
    const cookieStore = await cookies();
    const headerStore = await headers();

    const refresh_toke = cookieStore.get('sso_refresh')?.value ?? "";
    const agent = headerStore.get("user-agent") ?? "Desconocido";
    const ip = headerStore.get("x-forwarded-for") ?? "0";
    const result = await refreshToken(refresh_toke, ip, agent);

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
