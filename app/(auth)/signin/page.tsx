"use server"
import LoginPage from "@/components/Signin/login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function SiginPage({ searchParams }: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('sso_token')?.value ?? "eyJsb2dfaW5fc3RhdHVzIjpudWxsfQ==.eyJsb2dfaW5fc3RhdHVzIjpudWxsfQ=="
  const encodeData = atob(token?.split(".")[1]);
  const parseData = JSON.parse(encodeData);

  if (parseData.log_in_status === "WAIT") redirect("/mfa");
  if (parseData.log_status === "SUCCESS") redirect("/");
  return (
    <LoginPage />
  )
}

export default SiginPage