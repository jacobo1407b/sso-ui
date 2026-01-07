import RoleDetails from "@/components/Rols/Details";
import { GetRol } from "@/actions/rolsAction";
import { GetAll } from "@/actions/userAction";


async function RoleDetailsPage({ params }: any) {
    const prm = await params;
    const rol = await GetRol(prm.id);
    if (rol.code !== 200) return null;
    const { data } = await GetAll(1, 100);
    return (
        <RoleDetails roleId={prm.id} rolData={rol.data} users={data} />
    )
}

export default RoleDetailsPage