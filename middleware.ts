// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshToken, authorize, deleteSession } from '@/lib/conexiones';


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Excluir rutas públicas
  if (pathname.startsWith('/signin')) return NextResponse.next();

  const response = NextResponse.next();

  // 🧩 Extraer cookies individuales
  const sso_token = request.cookies.get('sso_token')?.value;
  const sso_token_expired = request.cookies.get('sso_token_expired')?.value;
  const sso_refresh = request.cookies.get('sso_refresh')?.value;
  const sso_refresh_expired = request.cookies.get('sso_refresh_expired')?.value;

  // 🧼 Validar existencia
  if (!sso_token || !sso_refresh || !sso_token_expired || !sso_refresh_expired) {
    console.warn('[SSO] Faltan cookies de sesión');
    //eliminar sesiones
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  const now = Date.now();
  const accessExp = new Date(sso_token_expired).getTime();
  const refreshExp = new Date(sso_refresh_expired).getTime();
  // 🔒 Refresh expirado
  if (now > refreshExp) {
    console.warn('[SSO] Refresh expirado');
    response.cookies.delete('sso_token');
    response.cookies.delete('sso_token_expired');
    response.cookies.delete('sso_refresh');
    response.cookies.delete('sso_refresh_expired');
    deleteSession("");
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // 🔁 Access expirado → intentar refresh
  if (now > accessExp) {
    const ip = request.headers.get('x-forwarded-for') || 'IP desconocida';
    const userAgent = request.headers.get('user-agent') ?? 'Desconocido';

    const refreshed = await refreshToken(sso_refresh, ip, userAgent);
    //console.log(refreshed)
    if (!refreshed?.accessToken) {
      console.error('[SSO] Falló el refresh');
      response.cookies.delete('sso_token');
      response.cookies.delete('sso_token_expired');
      response.cookies.delete('sso_refresh');
      response.cookies.delete('sso_refresh_expired');
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    // 🧠 Setear nuevas cookies
    response.cookies.set('sso_token', refreshed.accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('sso_token_expired', refreshed.accessTokenExpiresAt, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('sso_refresh', refreshed.refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('sso_refresh_expired', refreshed.refreshTokenExpiresAt, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    response.cookies.set('sso_session', btoa(refreshed.token_id), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    console.info(`[SSO] Token refrescado para user_id=${refreshed.user.user_id}`);
    return response;
  }

  // ✅ Validar token actual
  const isAuthorized = await authorize(sso_token);

  if (!isAuthorized?.next) {
    console.warn('[SSO] Token inválido');
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  console.log(request.url)
  response.cookies.set('sso_user', btoa(JSON.stringify(isAuthorized.user)), {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}


export const config = {
  matcher: [
    '/aplications/:path*',
    '/rols/:path*',
    '/users/:path*',
    '/settings',
    '/mfa',
    '/authorize',
    '/',
  ],
};
