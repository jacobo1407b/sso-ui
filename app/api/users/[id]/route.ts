import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import ApiError from '@/lib/api/Error';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = request.nextUrl;
        const operation = searchParams.get('operation') ?? "CREATE";

        const body = await request.json();
        let result = null;
        if (operation === "UPDATE") {
            result = await api.users.update(id, body);
        } else {
            result = await api.users.create(body);
        }


        return NextResponse.json(
            result,
            { status: result.code }
        );
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}