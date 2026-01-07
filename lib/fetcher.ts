"use client"

export async function fetcher(fn: () => Promise<any>) {
    const respBody = await fn();
    if (respBody.status !== 200 && respBody.status !== 201) {
        const setError = new Error(respBody.message);
        setError.name = `${respBody.status}|${respBody.code}|${respBody.details}`;
        setError.cause = respBody.status;
        throw setError;
    }
    return respBody;
}