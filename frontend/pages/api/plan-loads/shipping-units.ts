import withUser from 'lib/withUser'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import prisma from '../../../lib/db/prisma/index'
type Data = {
    [x: string]: any
}

const getPlanLoad = async (
    req: NextApiRequest__User,
    res: NextApiResponse<Data>
) => {
    const { purchaseOrderId } = req.query as any

    if (!purchaseOrderId) {
        res.status(400)
        return res.json({
            message: 'No purchase order query, this is required ',
        })
    }

    const vendorId =
        req.user.role === 'SUPERADMIN' ? { not: null } : req.user.vendorId

    const planLoad = await prisma.planLoads.findMany({
        where: {
            VendorId: vendorId,
            PurchaseOrderId: {
                equals: parseInt(purchaseOrderId),
            },
        },
    })
    res.json(planLoad)
}

export default withUser(getPlanLoad)
