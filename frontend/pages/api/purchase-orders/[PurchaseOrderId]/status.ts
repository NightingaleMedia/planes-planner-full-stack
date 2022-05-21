import { NextApiRequest, NextApiResponse } from 'next'
import { POStatuses } from 'src/constants'
import { APIError } from 'src/types/APIError'
import prisma from '../../../../lib/db/prisma/index'

export type Status__Response = {
    PurchaseOrderId: number | string
    POStatus: POStatuses | string
}
const getStatus = async (
    req: NextApiRequest,
    res: NextApiResponse<Status__Response | APIError>
) => {
    console.log(
        req.method,
        `/purchase-orders/${req.query.PurchaseOrderId}/status`
    )

    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Only get is accepted' })
    }

    const { PurchaseOrderId } = req.query as any
    const { POStatus } = await prisma.purchaseOrders.findUnique({
        where: {
            PurchaseOrderId: Number(PurchaseOrderId),
        },
    })

    return res.json({ PurchaseOrderId, POStatus })
}

export default getStatus
