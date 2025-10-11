'use server';

import { deleteSession, generateTotp, deleteTotp, verifyTotp, setPreferences } from "@/lib/conexiones";

export async function deleteSessionAction(id: string) {
    const resp = await deleteSession(id);
    return await resp.json();
}

export async function totpAction() {
    const data = await generateTotp();
    return await data.json();
}

export async function cancelTotp(id: string) {
    const cancel = await deleteTotp(id);
    return await cancel.json();
}

export async function validateTotp(id: string, code: string) {
    const valid = await verifyTotp(id,code);
    return await valid.json();
}

export async function putPreferences(id:string,payload:any) {
    const put = await setPreferences(id,payload);
    return await put.json();
}