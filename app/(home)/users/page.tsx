import Users from "@/components/Users";
import { api } from "@/lib/api"


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Usuarios - SSO',
};


export default async function UsersPage() {
  const { data, page, pageSize, totalCount, statusCode } = await api.users.getAll(true, { page: 1, pageSize: 20 });
  if (statusCode === 403) return null
  return <Users
    users={data}
    page={page}
    pageSize={pageSize}
    totalCount={totalCount}
  />
}
