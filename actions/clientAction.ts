"use server";
import { Actions } from "@/lib/conexiones";

const context = {}

export const GetClients = async (page?: number, pageSize?: number, appName?: string) => {
    const response = await Actions.callRest(context, {
        endpoint: 'Clients/GetClients',
        QueryParams: {
            page,
            pageSize,
            q: `app_name=${appName ?? ""}`
        }
    });
    return response.body
}
export const GetListGrants = async () => {
    const response = await Actions.callRest(context, {
        endpoint: "Clients/GetListGrants"
    });
    return response.body;
}
export const CreateApp = async (data: any, groupSelected: Array<string>) => {

    const response = await Actions.callRest(context, {
        endpoint: "Clients/CreateApp",
        body: {
            app: data.app_name,
            grants: groupSelected,
            data
        }
    });
    return response.body;
}
export const UpdateApp = async (data: any, id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Clients/UpdateApp",
        uriParams: {
            id
        },
        body: data
    });
    return response.body;
}
export const DeleteApp = async (id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Clients/DeleteApp",
        uriParams: {
            id
        }
    });
    return response.body;
}
export const AppDetails = async (id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Clients/AppDetails",
        uriParams: {
            id
        }
    });
    return response.body;
}
export const SetGrants = async (id: string, payload: any) => {
    const response = await Actions.callRest(context, {
        endpoint: "Clients/SetGrants",
        uriParams: {
            id
        },
        body: payload
    });
    return response.body;
}
export const UploadIcon = async (file: File, clientId: string, pub?: string) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await Actions.callRest(context, {
        endpoint: "Clients/SetGrants",
        uriParams: {
            clientId
        },
        QueryParams: {
            pub
        },
        body: formData
    });
    return response.body;
}