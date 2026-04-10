import { NextRequest, NextResponse } from 'next/server';
import { api } from "@/lib/api";
import ApiError from '@/lib/api/Error';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const pageNum = Number(searchParams.get('page')) || 1;
        const pageSize = Number(searchParams.get('pageSize')) || 20;
        const query = searchParams.get('q') || undefined;

        const data = await api.apps.getAll(false, {
            page: pageNum,
            pageSize,
            q: query
        });
        return NextResponse.json(
            data,
            { status: data.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const resp = await api.apps.create(body);
        return NextResponse.json(
            resp,
            { status: resp.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}