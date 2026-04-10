import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import ApiError from '@/lib/api/Error';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pub = searchParams.get("pub");
        const id = searchParams.get("id");
        const formData = await request.formData();
        const imgFile = formData.get("file") as File;

        const resp = await api.apps.uploadIcon(pub ?? "", id ?? "", imgFile);
        return NextResponse.json(
            resp,
            { status: resp.code }
        )

    } catch (error) {
        console.log(error)
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status })
    }
}