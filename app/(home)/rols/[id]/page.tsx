import RoleDetails from "@/components/Rols/Details";
import { api } from "@/lib/api";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalles de Rol - SSO',
};


async function RoleDetailsPage({ params }: any) {
    const prm = await params;

    const rol = await api.roles.getById(prm.id, true);
    if (rol.code !== 200) return null;
    const { data } = await api.users.getAll(true, { page: 1, pageSize: 100 });
    return (
        <RoleDetails roleId={prm.id} rolData={rol.data} users={data} />
    )
}

export default RoleDetailsPage