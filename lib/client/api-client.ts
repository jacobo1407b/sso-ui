import { SERVICE_CATALOG } from "./catalog";

interface EndpointConfig {
    endpoint: string;
    method: string;
    responseType: string;
}

export default class RequestServer<TResponse = unknown> {
    private baseUrl: string = "/api";
    private endpointApi: string = "";
    private method: string = "";
    private responseType: string = "json";
    private fileObject: FormData | null = null;
    private payload: string | null = null;

    constructor(catalog: string) {
        const [serviceKey, endpointKey] = catalog.split("/");
        const service = SERVICE_CATALOG[serviceKey as keyof typeof SERVICE_CATALOG];

        if (!service) throw new Error(`Service "${serviceKey}" not found in catalog`);

        const endpointConfig: EndpointConfig =
            service.paths[endpointKey as keyof typeof service.paths];

        if (!endpointConfig) throw new Error(`Endpoint "${endpointKey}" not found in service "${serviceKey}"`);

        this.endpointApi = endpointConfig.endpoint;
        this.method = endpointConfig.method;
        this.responseType = endpointConfig.responseType;
    }

    setUriParams(params: Record<string, string | number>): this {
        this.endpointApi = Object.entries(params).reduce(
            (url, [key, value]) => url.replace(`{${key}}`, String(value)),
            this.endpointApi
        );
        return this;
    }

    setQueryParams(queryParams: Record<string, string | number | undefined>): this {
        const clean = Object.entries(queryParams)
            .filter(([_, v]) => v !== undefined && v !== null)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {});

        const qs = new URLSearchParams(clean).toString();
        if (qs) this.endpointApi = `${this.endpointApi}?${qs}`;
        return this;
    }

    setPayload(payload: unknown): this {
        if (this.method === "GET") return this;

        if (payload instanceof File || payload instanceof Blob) {
            const form = new FormData();
            form.append("file", payload);
            this.fileObject = form;
        } else {
            this.payload = JSON.stringify(payload);
        }
        return this;
    }

    private handleError(response: Response, body: any): never {
        const error = new Error(`${body?.status}|${body?.code}|${body?.details}`);
        error.name = `${body?.status}|${body?.code}|${body?.details}`;
        error.cause = body?.status;
        throw error;
    }

    private async parseResponse(response: Response): Promise<TResponse> {
        return this.responseType === "json"
            ? response.json()
            : response.blob() as Promise<TResponse>;
    }

    private buildBody(): BodyInit | undefined {
        if (this.method === "GET") return undefined;
        return this.fileObject ?? this.payload ?? undefined;
    }

    private buildHeaders(): HeadersInit {
        if (this.fileObject) return {};
        return this.payload ? { "Content-Type": "application/json" } : {};
    }

    async exec(signal?: AbortSignal): Promise<TResponse> {
        const response = await fetch(`${this.baseUrl}${this.endpointApi}`, {
            method: this.method,
            headers: this.buildHeaders(),
            body: this.buildBody(),
            signal,
        });

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            this.handleError(response, body);
        }

        return this.parseResponse(response);
    }
}