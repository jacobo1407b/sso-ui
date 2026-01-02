"use server";
import { getClients, getListGrants, createApp, updateApp, deleteApp, getAppDetails, setGrantsApp, uploadAppIcon } from "@/lib/conexiones";

export async function getAllClients(page?: number, pageSize?: number, appName?: string) {
    const clients = await getClients(page, pageSize, appName);
    return await clients.json();
}
export async function getListGrantAction() {
    const list = await getListGrants();
    return await list.json();
}

export async function createClient(data: any, grants: Array<string>) {
    const resp = await createApp({
        app: data.app_name,
        grants,
        data
    });
    return await resp.json();
}

export async function updateAppAction(data: any, id: string) {
    const resp = await updateApp(data, id);
    return await resp.json();
}

export async function deleteAppAction(id: string) {
    const resp = await deleteApp(id);
    return await resp.json();
}

export async function getAppDetAction(id: string) {
    const resp = await getAppDetails(id);
    return await resp.json();
}

export async function setGrants(id: string, data: any) {
    const resp = await setGrantsApp(id, data);
    return await resp.json();
}

export async function uploadIconApp(file: File, id: string, pub?: string) {
    const resp = await uploadAppIcon(file, id, pub);
    return await resp.json();
}