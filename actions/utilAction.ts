"use server";
import { Actions } from "@/lib/conexiones";

const context = {}
export const DownloadImage = async (pub: string) => {
    const response = await Actions.callRest(context, {
        endpoint: "util/DownloadImage",
        QueryParams: {
            file: pub
        }
    });
    return response.body;
}