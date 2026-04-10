import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import ApiError from '@/lib/api/Error';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const resp = await api.apps.update(id, body);
        return NextResponse.json(
            resp,
            { status: resp.code }
        );
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await api.apps.delete(id);
        return NextResponse.json(
            { message: 'Application deleted successfully' },
            { status: 201 }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}