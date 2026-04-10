import Aplications from "@/components/Applications";
import { api } from "@/lib/api";




import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aplicaciones - SSO',
};


async function Aplication() {

  const resp = await api.apps.getAll(true,{
    page: 1,
    pageSize: 20
  });
  const listGrants = await api.apps.getGrants(true);
  if (resp.code === 403) return null;

  return <Aplications
    data={resp.data}
    page={resp.page}
    pageSize={resp.pageSize}
    totalPages={resp.totalCount}
    listGrants={listGrants.data}
  />
}

export default Aplication