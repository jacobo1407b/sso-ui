// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/lib/conexiones";
import { parse } from 'cookie';

export async function POST(request: Request) {
  const body = await request.json();
  const userAgent = request.headers.get('user-agent') ?? 'Desconocido';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() ?? 'IP no disponible';

  const { username, password } = body;

  const resp = await auth(username, password, ip, userAgent);
  const response = NextResponse.json(await resp.json(), {
    status: resp.status, // Aquí se asigna el status dinámicamente
  });

  const cook = parse(resp.headers.get('set-cookie') ?? "").session ?? "";
  console.log(cook)
  if (resp.status === 200) {
    response.cookies.set('sso_session', cook);

  }

  return response;
}
