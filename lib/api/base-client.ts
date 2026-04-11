import { cookies, headers as reqHeader } from 'next/headers';
import { ApiResponse } from '@/types';
import ApiError from './Error';
import OAuthServer from '../Auth';

interface SsoResponse {
  is_updated: boolean;
  sso_token: string | null;
  sso_refresh: string | null;
  sso_refresh_expired: string | null; // o number | null, según el formato de fecha
  sso_session: string | null;
  sso_token_expired: string | null;
  sso_user: any | null; // cámbialo por una interfaz de usuario si conoces la estructura
}



export class BaseClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  }

  private async getValidToken(agent: string, ip: string, isLoad: boolean): Promise<SsoResponse> {
    const cookieStore = await cookies();

    const token = cookieStore.get('sso_token')?.value || '';
    const expiredAt = cookieStore.get('sso_token_expired')?.value;
    const refreshToken = cookieStore.get('sso_refresh')?.value;

    try {
      if (!token) throw new Error("Token no encontrado")
      if (isLoad) return {
        is_updated: false,
        sso_token: token,
        sso_refresh: null,
        sso_refresh_expired: null,
        sso_session: null,
        sso_token_expired: null,
        sso_user: null
      }

      const isExpired = expiredAt
        ? new Date(expiredAt).getTime() <= Date.now() + 10_000
        : true;

      if (isExpired && refreshToken) {
        console.log("REFRESCO")
        const instanceOauth = await new OAuthServer().refresh();
        return { is_updated: true, ...instanceOauth.getStatus() };
      }
      return {
        is_updated: false,
        sso_token: token,
        sso_refresh: null,
        sso_refresh_expired: null,
        sso_session: null,
        sso_token_expired: null,
        sso_user: null
      }
    } catch (error) {
      return {
        is_updated: false,
        sso_token: null,
        sso_refresh: null,
        sso_refresh_expired: null,
        sso_session: null,
        sso_token_expired: null,
        sso_user: null
      }
    }
  }

  private async getHeaders(isMultipart = false, agent: string, ip: string, isLoad: boolean): Promise<Headers> {
    const respToken = await this.getValidToken(agent, ip, isLoad);

    if (!respToken.sso_token) throw new ApiError(401, "Unauthorized request: no authentication given", "unauthorized_request", "SYS");
    const cookieStore = await cookies();

    if (respToken.is_updated) (Object.entries(respToken) as [keyof SsoResponse, any][]).forEach(([key, value]) => {
      if (key.startsWith('sso_') && value !== null) {
        cookieStore.set(key, value, {
          httpOnly: true,    // 💡 Seguridad: No accesible desde JS del cliente
          secure: true,      // Solo por HTTPS
          maxAge: 60 * 60 * 24 * 7,   // 1 hora en segundos
          path: '/',         // Disponible en toda la web
          sameSite: 'lax' // Previene ataques CSRF
        });
      }
    });


    const headers = new Headers();
    if (!isMultipart) {
      headers.append('Content-Type', 'application/json');
    }
    headers.append('Authorization', `Bearer ${respToken.sso_token}`);
    return headers;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isMultipart = false,
    isLoadPage = false
  ): Promise<ApiResponse<T>> {
    const headersList = await reqHeader();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

    const headers = await this.getHeaders(isMultipart, userAgent, ip, isLoadPage);
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...Object.fromEntries(headers.entries()),
          ...(options.headers as any),
        },
      });
      //console.log(response)
      const contentType = response.headers.get("Content-Type") ?? "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await response.json() : await response.blob();
      

      if (!response.ok) {
        throw new ApiError(response.status, data.message || 'unknow', data.code, data.details || "SYS");
      }

      return data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, error instanceof Error ? error.message : 'Error desconocido');
    }
  }

  protected buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    let url = path;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
      const queryString = query.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return url;
  }
}
