"use server";
import { getRolsTabel, detailsRol, setRolUser } from "@/lib/conexiones";

export async function getRolsAction(page?: number, pageSize?: number, cod?: string) {
    const resp = await getRolsTabel(page, pageSize, cod);
    return await resp.json();
}

export async function rolDetailAction(id: string) {
    const resp = await detailsRol(id);
    return await resp.json();
}

export async function setUseRolAction(id: string, body: any) {
    const resp = await setRolUser(id, body);
    return await resp.json();
}