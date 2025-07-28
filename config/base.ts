export const urlBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
export const urlToken = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/token`;
export const urlAuthorize = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/authorize`;


type UserForm = {
    username: string,
    password: string
}
export const client_credentials = (grant_type: string, userForm: UserForm) => {
    const id = process.env.API_CLIENT_ID ?? "";
    const secret = process.env.API_CLIENT_SECRET ?? "";

    const body = new URLSearchParams({
        username: userForm.username,
        password: userForm.password,
        client_id: id,
        client_secret: secret,
        grant_type
    });
    return body;
}


