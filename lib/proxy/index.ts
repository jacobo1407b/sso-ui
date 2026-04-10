import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import OAuthServer, { ObjCookie } from '../Auth';

const REQUIRED_COOKIES = ['sso_token', 'sso_refresh', 'sso_token_expired', 'sso_refresh_expired'] as const;
const COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
};

export default class ProxyServer extends OAuthServer {
    private req: NextRequest;
    private originalUrl: string;
    private pathname: string;
    private session = {
        sso_refresh: '',
        sso_refresh_expired: '',
        sso_session: '',
        sso_token: '',
        sso_token_expired: '',
        sso_user: '',
    };

    private isRefreshed = false;


    constructor(request: NextRequest) {
        super();
        this.req = request;
        this.originalUrl = request.nextUrl.pathname + request.nextUrl.search;
        this.pathname = request.nextUrl.pathname;
    }

    // ─── Privados ──────────────────────────────────────────────

    private _getSessionCookies(): void {
        Object.keys(this.session).forEach((key) => {
            const value = this.req.cookies.get(key)?.value;
            if (value) this.session[key as keyof typeof this.session] = value;
        });
    }

    private _hasRequiredCookies(): boolean {
        return REQUIRED_COOKIES.every(key => !!this.session[key]);
    }

    private _redirectToSignIn(): NextResponse {
        const signInUrl = new URL('/signin', this.req.url);
        if (this.pathname === '/authorize') {
            signInUrl.searchParams.set('callbackUrl', this.originalUrl);
        }
        return NextResponse.redirect(signInUrl);
    }

    private _clearSession(response: NextResponse) {
        Object.keys(this.session).forEach(key => response.cookies.delete(key));
        return response;
    }

    private _isExpired(dateStr: string): boolean {
        return Date.now() > new Date(dateStr).getTime();
    }

    private _setTokenCookies(response: NextResponse, tokens: ObjCookie): NextResponse {
        Object.entries(tokens).forEach(([key, value]) => response.cookies.set(key, value, COOKIE_OPTIONS));
        return response;
    }
    // ─── Público ───────────────────────────────────────────────

    validateSession(): NextResponse | null {
        this._getSessionCookies();
        if (!this._hasRequiredCookies()) {
            console.warn('[SSO] Faltan cookies de sesión');
            return this._redirectToSignIn();
        }
        return null; // null = sesión válida, puede continuar
    }

    validateRefreshToken(): NextResponse | null {
        if (!this._isExpired(this.session.sso_refresh_expired)) return null;

        console.warn('[SSO] Refresh expirado');
        const redirect = this._redirectToSignIn();
        return this._clearSession(redirect);
    }

    async refreshAccessToken(): Promise<NextResponse | null> {
        try {
            if (!this._isExpired(this.session.sso_token_expired)) return null;
            await this.refresh();
            const refreshed = this.getStatus();
            const logStatus = this.getUserData()?.log_status;

            const target = logStatus === 'WAIT'
                ? NextResponse.redirect(new URL('/mfa', this.req.url))
                : NextResponse.next();

            console.info(`[SSO] Token refrescado`);
            this.isRefreshed = true;
            return this._setTokenCookies(target, refreshed);
        } catch (error) {
            console.error('[SSO] Falló el refresh');
            const redirect = this._redirectToSignIn();
            return this._clearSession(redirect);
        }

    }

    async authorizePage(): Promise<NextResponse> {
        const response = NextResponse.next();
        if (this.isRefreshed) {
            console.info('[SSO] Token recién refrescado, omitiendo authorize');
            return response
        } else {
            const isAuthorized = await this.isAuthenticate();

            if (isAuthorized?.user?.log_in_status === 'WAIT') {
                return NextResponse.redirect(new URL('/mfa', this.req.url));
            }

            if (!isAuthorized?.next) {
                console.warn('[SSO] Token inválido');
                const redirect = this._redirectToSignIn();
                return this._clearSession(redirect);
            }
            console.info('[SSO] Usuario autorizado');
            response.cookies.set('sso_user', btoa(JSON.stringify(isAuthorized.user)), COOKIE_OPTIONS);
            return response
        }


    }

}