import { useEffect, useState } from 'react';
import { User } from "@heroui/react";
import { useDB } from "@/components/IndexedDBProvider";
import { getImageBlob } from "@/actions/createUser";



interface AvatarCustomProps {
    name: string;
    email: string;
    profile_picture: string;
    last_update_avatar: number | null;
    user_id?: string;
}
function AvatarCustom({ name, email, profile_picture, last_update_avatar, user_id }: AvatarCustomProps) {
    const db = useDB();
    const [imageUrl, setImageUrl] = useState<string | undefined>()

    useEffect(() => {
        if (!db.ready) return;
        if (!profile_picture) return;

        const fetchImage = async () => {
            try {
                const result = await db.getByPub("profiles", profile_picture);

                // Caso 1: existe y está vigente
                if (result && result.image && result.fecha === last_update_avatar) {
                    setImageUrl(URL.createObjectURL(result.image as Blob));
                    return;
                }

                // Caso 2 y 3: no existe o está desactualizado
                const imgBlob = await getImageBlob(profile_picture);
                setImageUrl(URL.createObjectURL(imgBlob));

                const newRecord = {
                    fecha: last_update_avatar,
                    image: imgBlob,
                    pub: profile_picture,
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
    }, [db.ready, profile_picture]);


    return (
        <User
            avatarProps={{
                radius: "lg",
                src: imageUrl,
            }}
            name={name}
            description={email}
        />
    )
}

export default AvatarCustom