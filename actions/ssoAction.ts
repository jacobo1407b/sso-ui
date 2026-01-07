'use server';
import { Actions } from "@/lib/conexiones";


const context = {};

export const GetTotp = async () => {
    const response = await Actions.callRest(context, {
        endpoint: "SSO/GetTotp"
    });
    return response.body;
}
export const VerifyTotp = async (id: string, code: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "SSO/VerifyTotp",
        body: {
            id,
            code
        }
    });
    return response.body;
}
export const DeleteTotp = async (id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "SSO/DeleteTotp",
        uriParams: {
            id
        }
    });
    return response.body;
}
export const GetFederateData = async (client_id: string, userId: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "SSO/GetFederateData",
        QueryParams: {
            client_id,
            userId
        }
    });
    return response.body;
}