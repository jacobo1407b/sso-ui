import { NextRequest, NextResponse } from 'next/server';
import { api } from "@/lib/api";
import ApiError from '@/lib/api/Error';


export async function GET(request: NextRequest) {
    try {
        const result = await api.mfa.totp.createTotp();
        return NextResponse.json(
            result,
            { status: result.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const resp = await api.mfa.totp.verifyTotp(body.code, body.id);
        return NextResponse.json(
            resp,
            { status: resp.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        if (!id) throw new ApiError(400, "ID is required", "ID_REQUIRED", "SYS");
        const result = await api.mfa.totp.cancelTotp(id);
        return NextResponse.json(
            result,
            { status: result.code }
        )
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }

}