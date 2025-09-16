import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {authorize} from "@/lib/conexiones";

export async function middleware(request: NextRequest) {
    const auth = await authorize();
    if (auth) {
    // User is not authenticated, redirect to login
    return NextResponse.redirect(new URL('/signin', request.url));
  }
    return NextResponse.next();
}

export const config = {
  matcher: [
    '/aplications/:path*',
    '/rols/:path*',
    '/users/:path*',
    '/'
  ],
};
