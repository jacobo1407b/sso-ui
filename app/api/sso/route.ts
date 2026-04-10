import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import OAuthServer from '@/lib/Auth';

import { api } from "@/lib/api";
import ApiError from '@/lib/api/Error';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const ssoCookie = cookieStore.get('sso_session')?.value;
        if (!ssoCookie) throw new ApiError(401, "no session found", "NTF_SESSION", 'SYS');
        const cokieDef = new OAuthServer().getStatus();
        const decoded = Buffer.from(ssoCookie, 'base64').toString('utf-8');

        const body = await request.json();

        const rep = await api.users.changePasswordLogout(decoded, body);

        const response = NextResponse.json(rep, { status: rep.code });

        // Eliminar cookies en la respuesta para que el cliente las borre
        Object.keys(cokieDef).forEach((key) => {
            response.cookies.delete(key);
        });

        return response;
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }
};