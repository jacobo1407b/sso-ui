import DetailsUser from "@/components/Users/Details";
import { getUserDetail } from "@/lib/conexiones";
import { cookies } from 'next/headers';



export default async function UserPage({ params }: any) {
  const prm = await params;
  var currentUser = {
    user_id: prm.id,
    roles: [],
    rols: []
  };
  var roles = [];
  const cookie = await cookies();
  const raw = cookie.get('sso_user')?.value
  if (raw && prm.id === "1") {
    currentUser = JSON.parse(atob(raw))
    currentUser.user_id = JSON.parse(atob(raw)).userId
    roles = currentUser.rols.map((x: any) => {
      return x.role_code
    });
  }

  //const permisions = us.rols.map()
  const user = await getUserDetail(currentUser.user_id);

  return <DetailsUser user={user.data} userKey={prm.id} rols={roles} />;
}
