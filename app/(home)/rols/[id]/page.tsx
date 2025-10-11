import RoleDetails from "@/components/Rols/Details";
import { rolDetailAction } from "@/actions/rolsAction";
import { getUsers } from "@/lib/conexiones";

async function RoleDetailsPage({ params }: any) {
    const prm = await params;
    const rol = await rolDetailAction(prm.id);
    console.log(rol)
    if (rol.code !== 200) return null;
    const { data } = await getUsers(1, 100);
    return (
        <RoleDetails roleId={prm.id} rolData={rol.data} users={data} />
    )
}

export default RoleDetailsPage