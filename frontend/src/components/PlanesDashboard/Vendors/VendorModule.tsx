import React, { useContext } from 'react'
import AllVendorsTable from 'src/components/PlanesDashboard/Vendors/AllVendorsTable'
import Module from 'src/components/PlanesDashboard/Module'

import useAdminQuery from 'src/hooks/useAdminQuery'
import { VendorEditContext } from 'src/contexts/VendorEditContext'
import AddVendor__Modal from 'src/components/PlanesDashboard/Vendors/AddVendor__Modal'
import DeleteVendor__Modal from './DeleteVendor__Modal'
import EditVendor__Modal from './EditVendor__Modal'
const VendorModule = () => {
    const { openCreate } = useContext(VendorEditContext)

    const { mutate } = useAdminQuery({
        path: '/vendor',
    })

    return (
        <Module
            title={'Vendor Management'}
            actions={[
                {
                    name: 'Add Vendor',
                    onClick: () => openCreate(),
                },
            ]}
        >
            <AllVendorsTable />
            <AddVendor__Modal onCreate={mutate} />
            <DeleteVendor__Modal />
            <EditVendor__Modal />
        </Module>
    )
}

export default VendorModule
