import React, { useEffect, useState } from "react";
import { Avatar } from "@heroui/react";
import { useDB } from "../IndexedDBProvider";
import { Settings } from "lucide-react";
import RequestServer from "@/lib/client/api-client";

interface iIconProps {
    app: string;
    last_update_date: number | null;
    icon_url: string;
}

function IconComponent({ app, last_update_date, icon_url }: iIconProps) {

    const db = useDB();
    const [iconSrc, setIconSrc] = useState<string | null>(null);

    useEffect(() => {
        if (iconSrc) return;
        if (!db.ready) return;
        if (!icon_url) return;
        const loadIcon = async () => {
            const result = await db.getByPub("profiles", icon_url);
            // Caso 3: existe y está vigente
            if (result && result?.image && result?.fecha === last_update_date) {
                setIconSrc(URL.createObjectURL(result.image as Blob));
                return;
            }

            // Caso 1 y 2: no existe o está desactualizado
            console.log("Descargando icono desde la red...");

            const imgBlob = await new RequestServer<Blob>("Util/Download")
                .setQueryParams({ file: icon_url })
                .exec();

            setIconSrc(URL.createObjectURL(imgBlob));

            const newRecord = {
                fecha: last_update_date,
                image: imgBlob,
                pub: icon_url,
                user_id: app
            };

            if (!result?.id) {
                await db.add("profiles", newRecord);
            } else {
                await db.update("profiles", result.id, newRecord);
            }
        };

        loadIcon();
    }, [db.ready]);

    return (
        <div>
            {iconSrc ? (
                <Avatar size="sm" src={iconSrc} alt={app} />
            ) : (
                <Settings className="w-8 h-8 text-white" />
            )}
        </div>
    );
}

export default IconComponent;