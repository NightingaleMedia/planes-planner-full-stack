import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db/prisma/index'

const planLoadHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
): Promise<any> => {
    console.log(req.method, req.url)

    const { purchaseOrderId } = req.query as any
    let { index } = req.query as any

    if (!index || index === 'null') {
        index = 1
    }
    if (!purchaseOrderId) {
        return res
            .status(400)
            .send({ message: 'No purchase order id specified.' })
    }

    switch (req.method) {
        case 'GET':
            return await prisma.planLoads
                .findMany({
                    where: {
                        PurchaseOrderId: Number(purchaseOrderId),
                        PurchaseOrderIndex: Number(index),
                    },
                    select: {
                        LoadName: true,
                        PurchaseOrderId: true,
                        PurchaseOrderNbr: true,
                        PlanLoadId: true,
                    },
                })
                .then(result => {
                    if (result.length === 0) {
                        return res.status(404).json({ message: 'No Plan Load' })
                    }
                    res.json(result[0])
                })
                .catch(err =>
                    res.status(err.status).json({ message: err.message })
                )
        default:
            return res.status(404).json({ message: 'No endpoint for that.' })
    }
}

export default planLoadHandler
