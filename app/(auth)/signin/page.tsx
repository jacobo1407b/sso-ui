import LoginPage from "@/components/Signin/login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - SSO',
};

async function SiginPage({ searchParams }: any) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get('sso_token')?.value ?? "eyJsb2dfaW5fc3RhdHVzIjpudWxsfQ==.eyJsb2dfaW5fc3RhdHVzIjpudWxsfQ=="
  const encodeData = atob(token?.split(".")[1]);
  const parseData = JSON.parse(encodeData);

  if (parseData.log_in_status === "WAIT") redirect("/mfa");
  if (parseData.log_status === "SUCCESS") redirect("/");
  return (
    <LoginPage
      empresaCorp={process.env.NEXT_BUSSINESS_NAME ?? "EmpresaCorp"}
      abr={process.env.NEXT_ABR_BUSSINESS ?? "E"}
      callbackUrl={params.callbackUrl} />
  )
}

export default SiginPage


