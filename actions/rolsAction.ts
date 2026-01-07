"use server";
import { Actions } from "@/lib/conexiones";


const context = {}

export const GetRols = async (page?: number, size?: number, cod?: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Rols/GetRols",
        QueryParams: {
            page,
            size,
            rol_code: cod
        }
    });
    return response.body;
}
export const GetRol = async (id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Rols/GetRol",
        uriParams: {
            id
        }
    });
    return response.body;
}
export const SetRolUser = async (id: string, body: any) => {
    const response = await Actions.callRest(context, {
        endpoint: "Rols/SetRolUser",
        uriParams: {
            id
        },
        body
    });
    return response.body;
}