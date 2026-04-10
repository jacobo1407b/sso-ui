import { NextRequest, NextResponse } from 'next/server';
import { api } from "@/lib/api";
import ApiError from '@/lib/api/Error';

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        if (!id) throw new ApiError(400, "ID is required", "ID_REQUIRED", "SYS");
        const body = await request.json();

        const rep = await api.util.setPreferences(id, body);
        return NextResponse.json(
            rep,
            { status: rep.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }
};