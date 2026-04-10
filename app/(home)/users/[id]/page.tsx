import DetailsUser from "@/components/Users/Details";
import { api } from "@/lib/api";
import { cookies } from 'next/headers';



import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalles de Usuario - SSO',
};



export default async function UserPage({ params }: any) {
  const prm = await params;
  let isMain = false;

  var currentUser = {
    user_id: prm.id,
    roles: [],
    rols: []
  };
  var roles = [];
  const cookie = await cookies();
  const raw = cookie.get('sso_user')?.value
  if (raw && prm.id === "1") {
    isMain = true;
    currentUser = JSON.parse(atob(raw))
    currentUser.user_id = JSON.parse(atob(raw)).userId
    roles = currentUser.rols.map((x: any) => {
      return x.role_code
    });
  }

  //const permisions = us.rols.map()
  const user = await api.users.getById(true, currentUser.user_id);
  return <DetailsUser
    userData={user.data}
    userKey={prm.id}
    isMain={isMain}
    rols={roles} />;
}
