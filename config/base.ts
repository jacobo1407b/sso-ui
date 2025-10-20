export const urlBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
export const urlToken = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/token`;
export const urlAuthorize = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/authorize`;


type UserForm = {
    username: string,
    password: string
}
export const client_credentials = (grant_type: string, userForm: UserForm, ip?: string, userAgent?: string) => {
    const id = process.env.API_CLIENT_ID ?? "";
    const secret = process.env.API_CLIENT_SECRET ?? "";

    const body = new URLSearchParams({
        username: userForm.username,
        password: userForm.password,
        client_id: id,
        client_secret: secret,
        grant_type,
        ip: ip ?? "",
        userAgent: userAgent ?? ""
    });
    return body;
}

export const refreshSesion = (refres: string, ip?: string, userAgent?: string) => {
    const id = process.env.API_CLIENT_ID ?? "";
    const secret = process.env.API_CLIENT_SECRET ?? "";

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refres,
        client_id: id,
        client_secret: secret,
        ip: ip ?? "",
        userAgent: userAgent ?? ""
    });
    return body;
}

export const authorizeApp = (clientId: string, state: string) => {
    const body = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        state: state,
        grant_type: 'authorization_code'
    });
    return body;
}