// app/api/archivo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import ApiError from "@/lib/api/Error";

export async function GET(request: NextRequest) {
    try {
        // Llama al servicio que retorna un Blob
        const file = request.nextUrl.searchParams.get("file") ?? "";
        const resp = await api.util.download(file) as any
        const blob = resp as Blob;

        // Convierte el Blob a ArrayBuffer para poder enviarlo
        const arrayBuffer = await blob.arrayBuffer();


        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": blob.type || "application/octet-stream",
                "Content-Length": blob.size.toString()
            },
        });
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(error, { status });
    }
}