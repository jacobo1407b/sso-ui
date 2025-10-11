import Users from "@/components/Users";
import { getUsers } from "@/lib/conexiones";


export default async function UsersPage() {
  const { data, page, pageSize, totalCount, status } = await getUsers(1, 20);
  if(status === 403) return null

  return <Users
    users={data}
    page={page}
    pageSize={pageSize}
    totalCount={totalCount}
  />
}
