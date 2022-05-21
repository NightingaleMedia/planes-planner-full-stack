import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PoDetail } from '../../src/components/PlanesDashboard/PODetail'
import { LinearProgress } from '@material-ui/core'
import Head from 'next/head'
const PODetailPage = () => {
    const router = useRouter()

    const [id, setId] = useState(null)
    useEffect(() => {
        setId(router.query.purchaseOrderId)
    }, [])
    if (!id) {
        return <LinearProgress />
    }
    return (
        <>
            <Head>
                <title>Planes | PO Detail {id}</title>
            </Head>
            <PoDetail purchaseOrderId={id} />
        </>
    )
}

export default PODetailPage
