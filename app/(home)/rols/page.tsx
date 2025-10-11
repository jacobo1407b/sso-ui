import RolsPage from "@/components/Rols";
import { getRolsAction } from "@/actions/rolsAction";

async function Rols() {
  const listRols = await getRolsAction();
  if (listRols.code !== 200) return null;
  return <RolsPage rols={listRols.data} totalPage={listRols.total} />
}

export default Rols

