import { SERVICE_CATALOG } from "@/config/services-config";
import getAccessToken from "./token";



interface RestOptions {
    endpoint: string;      // Formato: "servicio/operacion"
    body?: any;
    uriParams?: Record<string, string | number>;
    QueryParams?: Record<string, string | number | undefined>;
    headers?: Record<string, string>;
}

interface EndpointConfig {
    endpoint: string,
    method: string,
    responseType: string,
    headers: Record<string, string>;
}

export const Actions = {
    callRest: async (context: any, options: RestOptions) => {
        // 1. Descomponer el endpoint (ej: "reports/JobReport")
        const [serviceKey, endPoint] = options.endpoint.split('/');
        const service = SERVICE_CATALOG[serviceKey as keyof typeof SERVICE_CATALOG];

        if (!service) {
            return {
                status: 404,
                message: "Servicio no definido",
                code: "SERVICE_NOT_DEFINED",
                details: "SYS"
            }
        }

        //let baseHeaders = service.servers.headers
        const baseUrl = service.servers.baseUrl;
        const endpontConfig: EndpointConfig = service.paths[endPoint as keyof typeof service.paths]
        console.log(endpontConfig)
        // 2. Construir URL con parámetros de ruta (uriParams)
        if (!endpontConfig) {
            return {
                status: 404,
                message: "Endpoint no definido",
                code: "ENDPOINT_NOT_DEFINED",
                details: "SYS"
            }
        }
        let path = endpontConfig.endpoint;
        if (options.uriParams) {
            Object.entries(options.uriParams).forEach(([key, value]) => {
                path = path.replace(`{${key}}`, String(value));
            });

        }
        if (options.QueryParams) {

            const cleanParams = Object.fromEntries(
                Object.entries(options.QueryParams).filter(([_, v]) => v !== undefined && v !== null)
            );

            const query = new URLSearchParams(cleanParams as any).toString();
            path += `?${query}`;
        }
        const token = await getAccessToken('sso_token');
        const url = `${baseUrl}${path}`;
        //  console.log("Calling URL:", url);
        // 3. Inyectar Seguridad (SSO/Tokens) - Como lo hace VB internamente

        const headers = new Headers({
            ...endpontConfig.headers,
            'Authorization': `Bearer ${token}`,
        });
        // 4. Ejecutar fetch
        const response = await fetch(url, {
            method: endpontConfig.method,
            headers,
            body: endpontConfig.method !== "GET" && options.body !== undefined ? JSON.stringify(options.body) : undefined
        });

        const respBody = endpontConfig.responseType === "json" ? await response.json() : await response.blob();

        /*if (!response.ok) {
            const setError = new Error(respBody.message);
            setError.name = `${respBody.status}|${respBody.code}|${respBody.details}`;
            throw setError;
        }*/

        return {
            ok: response.ok,
            status: response.status,
            body: {
                ...respBody,
                status: response.status
            },
            headers: response.headers,
        };
    }
};



