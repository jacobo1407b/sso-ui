import Aplications from "@/components/Applications";
import { getAllClients, getListGrantAction } from "@/actions/clientAction";

async function Aplication() {
  const resp = await getAllClients();
  const listGrants = await getListGrantAction();
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