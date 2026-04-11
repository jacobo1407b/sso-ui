
import { headers, cookies } from 'next/headers';
import ApiError from '../api/Error';
import { NextResponse } from 'next/server';



interface OAuthClient {
    clientId: string;
    app: string;
    clientSecret: string;
    app_icon: string;
    app_type: string;
    redirectUris: string[];
    grants: string[];
}

interface UserPreferences {
    id: string;
    theme: string;
    notifications: boolean;
    timezone: string | null;
    lang: string;
}

interface UserRole {
    role_code: string;
    module: string;
    policy_permission: string[];
}

export interface OAuthUser {
    user_id: string;
    username: string;
    name: string;
    last_name: string;
    second_last_name: string;
    email: string;
    phone: string;
    profile_picture: string;
    status: string | null;
    last_login: string;
    biografia: string | null;
    last_update_avatar: string;
    preferences: UserPreferences;
    userBusiness: unknown | null;
    roles: UserRole[];
    totp: boolean;
    log_status: string | null;
    totp_id: string;
}

interface OAuthTokenResponse {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    client: OAuthClient;
    user: OAuthUser;
    token_id: string;
    access_token: string;
    id_token: string;
    token_type: string;
    expires_in: number;
}

export interface ObjCookie {
    sso_session: string,
    sso_user: string,
    sso_token: string,
    sso_refresh: string,
    sso_refresh_expired: string,
    sso_token_expired: string
}

export interface IsAuthenticate {
    userId: string,
    exp: number,
    iat: number,
    username: string,
    client_id: string,
    rols: UserRole[],
    log_in_status?: string
    email:string
    profile_picture:string
    last_update_avatar:number
    log_status?:string
}
/** client_id=xxx                    → identifica la app
  &response_type=code              → indica que quiere un authorization code
  &state=uuid-generado-por-lux     → anti CSRF, generado por Lux
  &scope=openid email              → permisos que solicita
  &code_challenge=hash-del-verifier → PKCE, hash del verifier
  &code_challenge_method=S256      → algoritmo usado (SHA256) */
interface ParamsAuthCode {
    client_id: string,
    response_type: string,
    state?: string
    code_challenge?: string,
    code_challenge_method?: string
}

export interface AutorizationCodeResponse {
    authorizationCode: string,
    expiresAt: string,
    redirectUri: string,
    scope: string,
    client: { id: string },
    user: { id: string }
}
export default class OAuthServer {
    private baseUrl: string;
    private client: string;
    private secret: string;
    private params: URLSearchParams;
    private endpoint: string = "/oauth";
    private method: "POST" | "GET" | "DELETE" = "GET";
    private headers: Headers;
    private userData: OAuthUser | null = null;

    private cookieObj: ObjCookie = {
        sso_session: "",
        sso_user: "",
        sso_token: "",
        sso_refresh: "",
        sso_refresh_expired: "",
        sso_token_expired: ""
    }

    private response: NextResponse | null;

    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}`;
        this.client = process.env.API_CLIENT_ID ?? '';
        this.secret = process.env.API_CLIENT_SECRET ?? '';
        this.params = new URLSearchParams();
        this.headers = new Headers();
        this.response = null;
    }

    setParam(name: string, value: string): this {
        this.params.append(name, value);
        return this;
    }

    private async _token(username: string, password: string) {

        const hdrs = await headers();
        const agent = hdrs.get('user-agent') ?? 'unknown';
        const ip = hdrs.get('x-forwarded-for') ?? '127.0.0.1';

        this.params.append('grant_type', 'password');
        this.params.append('client_id', this.client);
        this.params.append('client_secret', this.secret);
        this.params.append("userAgent", agent);
        this.params.append("ip", ip);
        this.params.append("username", username);
        this.params.append("password", password);

        this.endpoint = this.endpoint + "/token";
        this.method = "POST"
        this.headers.append("Content-Type", "application/x-www-form-urlencoded");
    }

    private async _refresh() {
        const cookieStore = await cookies();

        const refresh = cookieStore.get("sso_refresh")?.value;
        if (!refresh) throw new ApiError(403, "refresh_token not found", "NOT_REFRSH_TOKEN", "SYS");
        const hdrs = await headers();
        const agent = hdrs.get('user-agent') ?? 'unknown';
        const ip = hdrs.get('x-forwarded-for') ?? '127.0.0.1';

        this.params.append('grant_type', 'refresh_token');
        this.params.append("refresh_token", refresh);
        this.params.append('client_id', this.client);
        this.params.append('client_secret', this.secret);
        this.params.append("userAgent", agent);
        this.params.append("ip", ip);

        this.endpoint = this.endpoint + "/token";
        this.method = "POST"
        this.headers.append("Content-Type", "application/x-www-form-urlencoded");
    }
    private async _auth_code(params: ParamsAuthCode) {
        const cookieStore = await cookies();
        const token = cookieStore.get("sso_token")?.value;
        if (!token) throw new ApiError(403, "token not found", "NOT_TOKEN", "SYS");

        Object.entries(params).forEach(([key, value]) => {
            this.params.append(key, value);
        });
        //this.params.append('grant_type', '');
        this.endpoint = this.endpoint + "/authorize";
        this.method = "POST"
        this.headers.append("Content-Type", "application/x-www-form-urlencoded");
        this.headers.append("Authorization", `Bearer ${token}`);
    }
    private async _isAuthenticate() {
        const cookieStore = await cookies();

        const token = cookieStore.get("sso_token")?.value;
        if (!token) throw new ApiError(403, "token not found", "NOT_TOKEN", "SYS");

        this.endpoint = this.endpoint + "/authorize";
        this.method = "GET"
        this.headers.append("Authorization", `Bearer ${token}`);

    }
    private async _exec<T>(): Promise<T> {
        const response = await fetch(this.baseUrl + this.endpoint, {
            method: this.method,
            headers: this.headers,
            body: this.method === "POST" ? this.params : undefined
        });
        //console.log(response)
        const resp = await response.json();
        //console.log(resp)
        if (!response.ok) throw new ApiError(resp.status, resp.message, resp.code, resp.details);
        return resp;
    }

    private async _revoke() {
        const cookieStore = await cookies();
        const token = cookieStore.get("sso_token")?.value;
        if (!token) throw new ApiError(403, "token not found", "NOT_TOKEN", "SYS");
        this.method = "DELETE";
        this.headers.append("Authorization", `Bearer ${token}`);
        this.endpoint = this.endpoint + "/revok";
    }
    // ─── Ejecución ──────────────────────────────────────────────────────────────
    async authorization_code(params: ParamsAuthCode) {
        await this._auth_code(params);
        const resp = await this._exec<AutorizationCodeResponse>();
        return resp;
    }
    async auth(username: string, password: string): Promise<this> {
        await this._token(username, password);
        const login = await this._exec<OAuthTokenResponse>();
        this.cookieObj = {
            sso_refresh: login.refreshToken,
            sso_session: btoa(login.token_id),
            sso_user: btoa(JSON.stringify(login.user)),
            sso_token: login.accessToken,
            sso_refresh_expired: login.refreshTokenExpiresAt,
            sso_token_expired: login.accessTokenExpiresAt
        }
        this.userData = login.user;
        return this;
    }
    async refresh(response?: NextResponse): Promise<this> {
        if (response) {
            this.response = response;
        }
        await this._refresh();
        const resp = await this._exec<OAuthTokenResponse>();
        this.cookieObj = {
            sso_refresh: resp.refreshToken,
            sso_session: btoa(resp.token_id),
            sso_user: btoa(JSON.stringify(resp.user)),
            sso_token: resp.accessToken,
            sso_refresh_expired: resp.refreshTokenExpiresAt,
            sso_token_expired: resp.accessTokenExpiresAt
        }
        this.userData = resp.user;
        return this;
    }
    async isAuthenticate() {
        try {
            await this._isAuthenticate();
            const data = await this._exec<IsAuthenticate>();
            return {
                next: true,
                user: data
            }
        } catch (error) {
            return {
                next: false,
                user: null
            }
        }
    }

    async revoke(response?: NextResponse) {
        const cookieStore = await cookies();
        await this._revoke();
        await this._exec();
        if (response) {
            Object.entries(this.cookieObj).forEach(([keys, value]) => {
                response.cookies.delete(keys);
            });
        } else {
            Object.entries(this.cookieObj).forEach(([keys, value]) => {
                cookieStore.delete(keys)
            });
        }
        return response;
    }
    async setCookies(): Promise<this> {
        if (this.response) {
            Object.entries(this.cookieObj).forEach(([keys, value]) => {
                this.response?.cookies.set(keys, value, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/',
                    sameSite: 'lax'
                })
            })
        } else {
            const cookieStore = await cookies();
            Object.entries(this.cookieObj).forEach(([keys, value]) => {
                cookieStore.set(keys, value, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/',
                    sameSite: 'lax'
                })
            })
        }
        return this;
    }
    deleteCookies(response?: NextResponse): this {
        if (response) {
            Object.entries(this.cookieObj).forEach(([keys, value]) => {
                response.cookies.delete(keys);
            });
        }
        return this;
    }

    async getResponseCookies() {
        return this.response;
    }
    getStatus() {
        return this.cookieObj;
    }

    getUserData() {
        return this.userData;
    }
    // ─── Privado ────────────────────────────────────────────────────────────────



    /*static async authorize(token: string): Promise<AuthorizeResult> {
        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/oauth/authorize`;

        const response = await fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { valid: false, status: data.status, message: data.message, code: data.code };
        }

        return { valid: true, data };
    }*/
}