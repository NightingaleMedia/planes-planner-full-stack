import React from 'react'

import UserEditProvider from 'src/contexts/UserEditContext'
import UserModule from 'src/components/PlanesDashboard/Users/UserModule'
const Users = props => {
    return (
        <UserEditProvider>
            <UserModule />
        </UserEditProvider>
    )
}

export default Users
