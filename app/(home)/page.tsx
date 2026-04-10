import HomePage from "@/components/Home";


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio - SSO',
};



export default async function Home() {
  /*const session = await validateSession();
  console.log(session)*/
  return <HomePage />
}
