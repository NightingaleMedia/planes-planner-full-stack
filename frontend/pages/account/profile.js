import React from 'react'
import ClientOnly from '../../src/components/Assets/ClientOnly'
import AccountGeneralSettings from '../../src/components/dashboard/account/AccountGeneralSettings'

const Profile = () => (
    <>
        <ClientOnly>
            <AccountGeneralSettings />
        </ClientOnly>
    </>
)

export default Profile
