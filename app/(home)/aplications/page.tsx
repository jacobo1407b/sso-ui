import Aplications from "@/components/Applications";
import { GetClients, GetListGrants } from "@/actions/clientAction";

async function Aplication() {
  const resp = await GetClients(1,20);
  const listGrants = await GetListGrants();
  if(resp.code === 403) return null;

  return <Aplications
    data={resp.data}
    page={resp.page}
    pageSize={resp.pageSize}
    totalPages={resp.totalCount}
    listGrants={listGrants.data}
  />
}

export default Aplication