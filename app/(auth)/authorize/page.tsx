import OAuthConsent from "@/components/Authorize";
import { parseToken } from "@/utils";
import { cookies } from 'next/headers';
import { api } from "@/lib/api";
import { redirect } from "next/navigation";


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autorizar Acceso - SSO',
};


async function OAuthConsentPage({ searchParams }: any) {
  const cookie = await cookies();
  const params = await searchParams;

  const session = cookie.get('sso_token')?.value;
  if (!session) return null;
  const user = parseToken(session);

  const { data } = await api.util.getFederated(params.client_id, user.userId);
  if(!data.app_name) redirect("/")
  return <OAuthConsent
    state={params.state}
    appName={data.app_name}
    company={process.env.NEXT_BUSSINESS_NAME}
    appDescription={data.description}
    appLogo={data.client_icon_url}
    last_update_date={data.last_update_date}
    userName={user.name}
    userEmail={user.email}
    userAvatar={data.profile_picture}
    clientId={params.client_id}
    last_update_avatar={data.last_update_avatar}
    userId={user.userId}
    code_challenge={params.code_challenge}
  />
}

export default OAuthConsentPage;