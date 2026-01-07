export const urlBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
const urlToken = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/token`;
const urlAuthorize = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/authorize`;

interface RequestFlow {
    token?: string;
    params: any
}

type LoginRequest = {
    username: string;
    password: string;
    ip?: string;
    userAgent: string
}

type RequestRefresh = {
    refresh_token: string;
    ip?: string;
    userAgent: string
}
type RequestAuthorizationCode = {
    client_id: string;
    state: string;
    redirect_uri?: string
}
const getClientCredentials = () => ({
    client_id: process.env.API_CLIENT_ID ?? "",
    client_secret: process.env.API_CLIENT_SECRET ?? ""
});

const buildParams = (params: Record<string, string | undefined>) => {
    const { client_id, client_secret } = getClientCredentials();
    return new URLSearchParams({
        client_id,
        client_secret,
        ...Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        )
    });
};


const callFlow = async (context: RequestFlow, operation: string | null) => {

    const { token, params } = context;
    const url = operation === 'password' || operation === 'refresh_token' ? urlToken : urlAuthorize
    const body = operation === 'password' || operation === 'refresh_token' ? buildParams({ grant_type: operation, ...params }) : new URLSearchParams(params);

    const headers = operation ? new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    }) : new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
    })

    const result = await fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body
    });
    const resp = await result.json();
    return {
        status: result.status,
        ...resp
    }
}


export const Backends = {
    "core": {
        baseUrl: urlBase,
        headers: { 'Authorization': 'token' }
    }
}
export const flows = {
    getJsonToken: async (context: LoginRequest) => {
        return await callFlow({ params: context }, "password");
    },
    RefreshToken: async (context: RequestRefresh) => {
        return await callFlow({ params: context }, "refresh_token");
    },
    Authorize: async (token: string) => {
        const data = await fetch(urlAuthorize, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const user = await data.json();

        if (data.status !== 200) return {
            next: false,
            user: null
        };
        if (data.status === 200) return {
            next: true,
            user
        }
    },
    GetAuthorizationCode: async (params: RequestAuthorizationCode, token: string) => {
        return await callFlow({
            params: {
                response_type: "code",
                ...params
            }, token
        }, null);
    }
}
