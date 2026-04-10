// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import ProxyServer from './lib/proxy';


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/signin')) return NextResponse.next();
  const server = new ProxyServer(request);
  // validar si existe sesion
  const sessionResult = server.validateSession();
  if (sessionResult) return sessionResult;

  // validar refresh token
  const refreshResult = await server.validateRefreshToken();
  if (refreshResult) return refreshResult;

  //validar refresh
  const refreshAccessTokenResult = await server.refreshAccessToken();
  if (refreshAccessTokenResult) return refreshAccessTokenResult;

  return await server.authorizePage();
}


export const config = {
  matcher: [
    '/aplications/:path*',
    '/rols/:path*',
    '/users/:path*',
    '/settings',
    '/authorize',
    '/',
  ],
};
