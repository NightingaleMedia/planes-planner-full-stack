import React from 'react'
import dynamic from 'next/dynamic'
import { LinearProgress } from '@material-ui/core'
import Head from 'next/head'
import Module from 'src/components/PlanesDashboard/Module'
import AllOrdersTable__Loading from 'src/components/PlanesDashboard/AllOrdersTable__Loading'

const AllOrdersTable = dynamic(
    () => import('../../../src/components/PlanesDashboard/AllOrdersTable'),
    {
        ssr: false,
        loading: () => (
            <Module title={'Vendor Purchase Orders'}>
                <AllOrdersTable__Loading />
            </Module>
        ),
    }
)

const OrdersHome = () => (
    <>
        <Head>
            <title>Open Purchase Orders</title>
        </Head>
        <AllOrdersTable orderQuery="open" />
    </>
)

export default OrdersHome
