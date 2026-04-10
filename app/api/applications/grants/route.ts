import { NextRequest, NextResponse } from 'next/server';
import { api } from "@/lib/api";
import ApiError from '@/lib/api/Error';


export async function POST(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id') || "";
        const body = await request.json();
        const resp = await api.apps.setGrants(id, body);
        return NextResponse.json(
            resp,
            { status: resp.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}