import "@/styles/globals.css";
import { Metadata } from 'next';
import NotFound from '@/components/404';
export const metadata: Metadata = {
  title: '404 - SSO',
};


function PageNotFound() {
  return <NotFound />
}

export default PageNotFound