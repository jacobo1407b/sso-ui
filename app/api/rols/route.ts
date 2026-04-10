import { NextRequest, NextResponse } from 'next/server';
import { api } from "@/lib/api";
import ApiError from '@/lib/api/Error';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const page = Number(searchParams.get('page') || 1); // Obtiene el valor de ?role=...
        const size = Number(searchParams.get('size') || '20');
        const rol_code = searchParams.get('rol_code') ?? undefined;

        const data = await api.roles.getAll(false, {
            page,
            size,
            rol_code
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

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const roleId = searchParams.get('roleId');
        if (!roleId) throw new ApiError(400, "roleId is required", "ROLE_ID_REQUIRED", "SYS");
        const body = await request.json();
        const rep = await api.roles.assignToUser(roleId, body);
        return NextResponse.json(
            rep,
            { status: rep.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }
}