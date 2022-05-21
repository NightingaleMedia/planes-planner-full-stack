import React from 'react'
import ClientOnly from '../../src/components/Assets/ClientOnly'
import AccountSecuritySettings from '../../src/components/dashboard/account/AccountSecuritySettings'
import Head from 'next/head'
const ResetPassword = () => (
    <div>
        <Head>
            <title>Reset Password</title>
        </Head>
        <ClientOnly>
            <AccountSecuritySettings />
        </ClientOnly>
    </div>
)

ResetPassword.propTypes = {}

export default ResetPassword
