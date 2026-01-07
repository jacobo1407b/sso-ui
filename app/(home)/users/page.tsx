import Users from "@/components/Users";
import {GetAll} from "@/actions/userAction";


export default async function UsersPage() {
  const { data, page, pageSize, totalCount, status } = await GetAll(1, 20);
  if(status === 403) return null

  return <Users
    users={data}
    page={page}
    pageSize={pageSize}
    totalCount={totalCount}
  />
}
