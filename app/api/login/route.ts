// app/api/login/route.ts
import { NextResponse } from 'next/server';
import {auth} from "@/lib/conexiones";
import { parse } from 'cookie';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const resp = await auth(username,password);
  const response = NextResponse.json({ ok: true });
  const cook = parse(resp.headers.get('set-cookie') ?? "").session ?? "";

  response.cookies.set('sso_session', cook, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return response;
}
