import React from 'react';
import DetailsApp from '@/components/Applications/Details';
import { getListGrantAction, getAppDetAction } from '@/actions/clientAction';




export default async function AppDetails({ params }: any) {
    const prm = await params;
    const list = await getListGrantAction();
    const data = await getAppDetAction(prm.id);

    return <DetailsApp appOne={data.data} list={list.data} />
}
