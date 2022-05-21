import withUser from 'lib/withUser'
import { NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import { checkPo } from './finalize-items'
import { changeStatus } from '../services/changeStatus'
import prisma from '../../../../lib/db/prisma/index'
import { changePlanLoadLocation } from 'pages/api/plan-loads/services/changeLocation'

const finalizeUnits = async (
    req: NextApiRequest__User,
    res: NextApiResponse<any>
) => {
    const { PurchaseOrderId, planLoadId } = req.query
    let status = 'readyToShipInFull'

    if (!planLoadId || !PurchaseOrderId) {
        return res
            .status(401)
            .json({ message: 'planLoadId and PurchaseOrderId required' })
    }

    const where =
        req.user.role === 'SUPERADMIN'
            ? { PurchaseOrderId: Number(PurchaseOrderId) }
            : {
                  PurchaseOrderId: Number(PurchaseOrderId),
                  VendorId: req.user.vendorId,
              }
    const po = await prisma.purchaseOrders.findMany({
        where,
    })

    if (!po || po.length === 0) {
        return res
            .status(401)
            .json({ message: 'Unauthorized to finalize this unit.' })
    }
    switch (req.method) {
        case 'PUT':
            try {
                // see if all items accounted for
                await checkPo(PurchaseOrderId)
            } catch (error) {
                // the user has already confirmed they want to short ship
                status = 'readyToShipPartial'
            }
            try {
                const data = await changeStatus(PurchaseOrderId, status)
                if (status === 'readyToShipPartial') {
                    // change location to 10489
                    await changePlanLoadLocation(planLoadId, 10489)
                }
                if (status === 'readyToShipInFull') {
                    // change location to 10490
                    await changePlanLoadLocation(planLoadId, 10490)
                }
                return res.json({ message: data })
            } catch (error) {
                console.log('error in finalize: ', error)
                return res.status(400).json({ message: error.message })
            }

        default:
            return res
                .status(404)
                .json({ message: 'Only a put request is allowed' })
    }
}

export default withUser(finalizeUnits)
