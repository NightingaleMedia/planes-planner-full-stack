import React from 'react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'
import prisma from '../../../lib/db/prisma'
import { PlanLoads, PlanLoadShippingUnits } from '.prisma/client'
import { PurchaseOrderId__Props } from 'src/types'
import { LOCKED_STATUS } from 'src/constants'
import { LinearProgress } from '@material-ui/core'

const AllPrepareUnitsModule = dynamic(
    () =>
        import(
            'src/components/PlanesDashboard/PrepareItems/AllPrepareUnitsModule'
        ),
    {
        ssr: false,
        loading: () => <LinearProgress />,
    }
)

export type ShipUnitAndPlanLoad = {
    unit: PlanLoadShippingUnits | null
    planLoad: PlanLoads | null
}

const PrepareShippingUnits = ({
    purchaseOrderId,
}: PurchaseOrderId__Props): React.ReactNode => {
    return <AllPrepareUnitsModule purchaseOrderId={purchaseOrderId} />
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<any> {
    const { purchaseOrderId } = ctx.query
    // convert to num
    const id = Number(purchaseOrderId)
    const { POStatus } = await prisma.purchaseOrders.findUnique({
        where: { PurchaseOrderId: id },
        select: { POStatus: true },
    })
    if (LOCKED_STATUS.includes(POStatus)) {
        console.log({ statis: POStatus })
        return {
            redirect: {
                destination: `/orders/${purchaseOrderId}`,
                permanent: false,
            },
        }
    } else {
        return {
            props: {
                purchaseOrderId: id,
            },
        }
    }
}

export default PrepareShippingUnits
