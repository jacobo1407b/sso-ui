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
        if (!id) throw new ApiError(400, "Bad request", "missing_params", "SYS");
        const result = await api.users.uploadFile(id, pub ?? "", imgFile);
        return NextResponse.json(
            result,
            { status: result.code }
        );
    } catch (error) {  
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }
}