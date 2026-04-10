import DetailsApp from '@/components/Applications/Details';
import { api } from '@/lib/api';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalles de Aplicación - SSO',
};


export default async function AppDetails({ params }: any) {
    const prm = await params;
    const list = await api.apps.getGrants(true);
    const data = await api.apps.getById(prm.id, true)
    return <DetailsApp appOne={data.data} list={list.data} />
}
