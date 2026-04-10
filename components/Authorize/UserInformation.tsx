
import { useEffect, useState } from 'react';
import { useDB } from "@/components/IndexedDBProvider";
import RequestServer from '@/lib/client/api-client';



import { Avatar, Chip } from "@heroui/react"


interface iUserInfoProps {
    userAvatar: string | undefined
    userName: string
    userEmail: string
    last_update_avatar: number | null
    user_id: string
}
function UserInformation({ userAvatar, userEmail, userName, last_update_avatar, user_id }: iUserInfoProps) {
    const db = useDB();

    const [imageUrl, setImageUrl] = useState<string | undefined>()

    useEffect(() => {
        if (!db.ready) return;
        if (!userAvatar || !last_update_avatar) return;

        const fetchImage = async () => {
            try {
                const result = await db.getByPub("profiles", userAvatar);

                // Caso 1: existe y está vigente
                if (result && result.image && result.fecha === last_update_avatar) {
                    setImageUrl(URL.createObjectURL(result.image as Blob));
                    return;
                }

                // Caso 2 y 3: no existe o está desactualizado
                const imgBlob = await new RequestServer<Blob>("Util/Download")
                    .setQueryParams({ file: userAvatar })
                    .exec();


                setImageUrl(URL.createObjectURL(imgBlob));

                const newRecord = {
                    fecha: last_update_avatar,
                    image: imgBlob,
                    pub: userAvatar,
                    user_id: user_id || ""
                };

                if (!result?.id) {
                    // No existe → crear
                    await db.add("profiles", newRecord);
                } else {
                    // Existe pero desactualizado → actualizar
                    await db.update("profiles", result.id, newRecord);
                }

            } catch (err) {
                console.error("Error cargando imagen:", err);
            }
        };

        fetchImage();
    }, [db.ready, userAvatar]);

    return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Avatar src={imageUrl} size="md" name={userName} />
            <div className="flex-1">
                <p className="font-semibold text-foreground">{userName}</p>
                <p className="text-sm text-default-500">{userEmail}</p>
            </div>
            <Chip size="sm" color="success" variant="flat">
                Conectado
            </Chip>
        </div>
    )
}

export default UserInformation