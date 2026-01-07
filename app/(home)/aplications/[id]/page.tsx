import React from 'react';
import DetailsApp from '@/components/Applications/Details';
import { GetListGrants, AppDetails as DetailsAction } from '@/actions/clientAction';




export default async function AppDetails({ params }: any) {
    const prm = await params;
    const list = await GetListGrants();
    const data = await DetailsAction(prm.id);
    return <DetailsApp appOne={data.data} list={list.data} />
}
