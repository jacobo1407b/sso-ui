// app/actions/createUser.ts
"use server";
import { createUserServer, updateUserServ, updatePassword } from "@/lib/conexiones";

export async function createUser(formData: any) {
    const sanitize = (str: string) =>
        str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const name = sanitize(formData.name);
    const last = sanitize(formData.last_name);
    const date = new Date().getFullYear().toString().slice(-2);
    const username = `${name}.${last}.${date}`;
    const payload = {
        ...formData,
        username
    }
    const resp = await createUserServer(payload);
    const data = await resp.json();

    return { data: data.data, status: resp.status, name: data.name }
}

export async function updateUser(params: any, id: string) {
    const upt = await updateUserServ(params, id);
    const data = await upt.json();
    return { data: data.data, status: upt.status, name: data.name }
}

export async function setPassword(id: string, pass: string) {
    const resp = await updatePassword(id, pass);
    const data = await resp.json();
    return data;
}