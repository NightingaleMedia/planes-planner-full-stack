import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import { LinearProgress } from '@material-ui/core'
import Module from 'src/components/PlanesDashboard/Module'
import AllOrdersTable__Loading from 'src/components/PlanesDashboard/AllOrdersTable__Loading'
import useAuth from 'src/hooks/useAuth'
import AllOrdersAdminTable from 'src/components/Admin/AllOrdersAdminTable'

const AllOrdersTable = dynamic(
    () => import('../../src/components/PlanesDashboard/AllOrdersTable'),
    {
        ssr: false,
        loading: () => (
            <Module title={'Vendor Purchase Orders'}>
                <AllOrdersTable__Loading />
            </Module>
        ),
    }
)

const OrdersHome = () => {
    const { user } = useAuth()

    if (user.role === 'SUPERADMIN') {
        return (
            <>
                <AllOrdersAdminTable />
            </>
        )
    } else {
        return (
            <>
                <AllOrdersTable />
            </>
        )
    }
}

export default OrdersHome
