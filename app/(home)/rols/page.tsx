import RolsPage from "@/components/Rols";
import { GetRols } from "@/actions/rolsAction";

async function Rols() {
  const listRols = await GetRols(1, 20, undefined);

  if (listRols.code !== 200) return null;
  return <RolsPage
    rols={listRols.data}
    totalPage={listRols.total}
    page={listRols.page}
    pageSize={listRols.pageSize}
  />
}

export default Rols

