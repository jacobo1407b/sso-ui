import { NextRequest, NextResponse } from 'next/server';
import { api } from "@/lib/api";
import ApiError from '@/lib/api/Error';
import { cookies } from 'next/headers';
import OAuthServer from '@/lib/Auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const page = Number(searchParams.get('page') || 1); // Obtiene el valor de ?role=...
        const pageSize = Number(searchParams.get('pageSize') || '20');
        const user = searchParams.get('user') ?? undefined;

        const data = await api.users.getAll(false, {
            page,
            pageSize,
            user
        });
        return NextResponse.json(
            data,
            { status: data.code }
        );
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id') ?? undefined;

        const cookieStore = await cookies();
        const currentSession = cookieStore.get('sso_session')?.value;
        if (!currentSession || !id) throw new ApiError(401, "Unauthorized", "SESSION_NOT_FOUND", 'SYS');
        const sesion = atob(currentSession);
        const isMain = sesion === id ? "Y" : "N";
        const resp = await api.users.deleteSession(id, isMain);
        if (isMain === "Y") {
            const oauth = new OAuthServer().getStatus();
            Object.entries(oauth).forEach(([key, value]) => {
                cookieStore.delete(key)
            });
        }
        return NextResponse.json(
            resp,
            { status: resp.code }
        );

    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}