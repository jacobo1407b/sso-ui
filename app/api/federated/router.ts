import { NextRequest, NextResponse } from 'next/server';
import { api } from "@/lib/api";
import { cookies } from 'next/headers';
import ApiError from '@/lib/api/Error';
import { parseToken } from '@/utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const cookie = await cookies();
        const client_id = searchParams.get('client_id');

        const session = cookie.get('sso_token')?.value;


        if (!client_id || !session) throw new ApiError(400, 'Missing client id o userid params', 'NTF', 'SYS');
        const user = parseToken(session)
        const resp = await api.util.getFederated(client_id, user.userId);
        return NextResponse.json(
            resp,
            { status: resp.code }
        )

    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}
