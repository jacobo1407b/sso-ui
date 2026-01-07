// app/actions/createUser.ts
"use server";
import { Actions } from "@/lib/conexiones";
import { cookies } from 'next/headers';



const context = {};
const sanitize = (str: string) => str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');


export const GetAll = async (page = 1, pageSize = 20, user?: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Users/GetAll",
        QueryParams: {
            page,
            pageSize,
            user
        }
    });
    return response.body;
}
export const UserDetail = async (user_id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Users/UserDetail",
        uriParams: {
            id: user_id
        }
    });
    return response.body;
}
export const CreateUser = async (formData: any) => {
    const name = sanitize(formData.name);
    const last = sanitize(formData.last_name);
    const date = new Date().getFullYear().toString().slice(-2);
    const username = `${name}.${last}.${date}`;
    const payload = {
        ...formData,
        username
    }
    const response = await Actions.callRest(context, {
        endpoint: "Users/CreateUser",
        body: payload
    });
    return response.body;
    //    return { data: data.data, status: resp.status, name: data.name }
}
export const UpdateUser = async (data: any, id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Users/UpdateUser",
        body: data,
        uriParams: {
            id
        }
    });
    return response.body;
    //    return { data: data.data, status: upt.status, name: data.name }
}
export const GetSesions = async (id: string, sesion_id: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Users/GetSesions",
        uriParams: {
            id
        },
        QueryParams: {
            session: sesion_id
        }
    });
    return response.body;
}
export const UpdatePassword = async (id: string, password: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "Users/UpdatePassword",
        uriParams: {
            id
        },
        body: {
            pass: password
        }
    });
    return response.body;
}
export const DeleteSession = async (idSession: string | null) => {
    const cookieStore = await cookies();
    const currentSession = cookieStore.get('sso_session')?.value ?? ""
    const sesion = idSession ?? atob(currentSession);
    const response = await Actions.callRest(context, {
        endpoint: "Users/DeleteSession",
        uriParams: {
            idSession: sesion
        }
    });
    if (!idSession) {
        cookieStore.delete("sso_session");
        cookieStore.delete("sso_refresh");
        cookieStore.delete("sso_refresh_expired");
        cookieStore.delete("sso_token");
        cookieStore.delete("sso_token_expired");
        cookieStore.delete("sso_user");
    }
    return response.body;
}
export const SetPreferences = async (id: string, payload: any) => {
    const response = await Actions.callRest(context, {
        endpoint: "Users/SetPreferences",
        uriParams: {
            id
        },
        body: payload
    });
    return response.body;
}
export const UploadProfile = async (file: File, id: string, pub?: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await Actions.callRest(context, {
        endpoint: "Users/UploadProfile",
        uriParams: {
            userId: id
        },
        QueryParams: {
            pub
        },
        body: formData
    });
    return response.body;
}