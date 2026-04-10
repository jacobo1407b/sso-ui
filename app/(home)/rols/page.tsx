import RolsPage from "@/components/Rols";
import { api } from "@/lib/api";



import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Roles - SSO',
};


async function Rols() {

  const listRols = await api.roles.getAll(true, {
    page: 1,
    size: 20,
    rol_code: undefined
  })

  if (listRols.code !== 200) return null;
  return <RolsPage
    rols={listRols.data}
    totalPage={listRols.total ?? 0}
    page={listRols.page}
    pageSize={listRols.pageSize}
  />
}

export default Rols

