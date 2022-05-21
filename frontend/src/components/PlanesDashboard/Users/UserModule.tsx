import React, { useContext } from 'react'

import Module from 'src/components/PlanesDashboard/Module'
import AddUser__Modal from 'src/components/PlanesDashboard/Users/AddUser__Modal'
import AllUsersTable from 'src/components/PlanesDashboard/Users/AllUsersTable'

import EditUser__Modal from 'src/components/PlanesDashboard/Users/EditUser__Modal'
import DeleteUser__Modal from 'src/components/PlanesDashboard/Users/DeleteUser__Modal'
import { UserEditContext } from 'src/contexts/UserEditContext'
const UserModule = () => {
    const { openCreate } = useContext(UserEditContext)

    return (
        <Module
            title={'User Management'}
            actions={[
                {
                    name: 'Add A User',
                    onClick: () => openCreate(),
                },
            ]}
        >
            <AllUsersTable />
            <AddUser__Modal />
            <EditUser__Modal />
            <DeleteUser__Modal />
        </Module>
    )
}

export default UserModule
