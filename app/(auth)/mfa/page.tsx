"use server"
import MfaVerification from "@/components/Mfa";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


async function MfaVerifyPage({ searchParams }: any) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get('sso_token')?.value ?? "eyJsb2dfaW5fc3RhdHVzIjpudWxsfQ==.eyJsb2dfaW5fc3RhdHVzIjpudWxsfQ=="
  const encodeData = atob(token?.split(".")[1]);
  const parseData = JSON.parse(encodeData);
  if (parseData.log_status === "SUCCESS") redirect("/");
  if (parseData.log_in_status === null) redirect("/signin");


  return <MfaVerification
    userEmail={parseData.email}
    userAvatar={parseData.profile_picture}
    availableMethods={["totp"]}
    totp_id={parseData.totp_id}
    callbackUrl={params.callbackUrl}
  />
}

export default MfaVerifyPage;