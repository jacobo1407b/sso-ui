"use server";
import OAuthConsent from "@/components/Authorize";
import { parseToken } from "@/utils";
import { cookies } from 'next/headers';
import { getFederateInfo } from "@/actions/createUser";
import { Federate } from "@/types";

async function OAuthConsentPage({ searchParams }: any) {
  const cookie = await cookies();
  const params = await searchParams;
  const session = cookie.get('sso_token')?.value ?? "";
  const user = parseToken(session)


  const { data }: { data: Federate } = await getFederateInfo(params.client_id, user.userId);



  return <OAuthConsent
    state={params.state}
    appName={data.app_name}
    appDescription={data.description}
    appLogo={data.client_icon_url}
    userName={user.name}
    userEmail={user.email}
    userAvatar={data.profile_picture}
    clientId={params.client_id}
  />
}

export default OAuthConsentPage;