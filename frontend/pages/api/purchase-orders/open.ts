import { Prisma, PurchaseOrders } from '.prisma/client'
import withUser from 'lib/withUser'
import { NextApiResponse } from 'next'
import { LOCKED_STATUS } from 'src/constants'
import { NextApiRequest__User, PurchaseOrderDetails } from 'src/types'
import { APIError } from 'src/types/APIError'
import { AllPoResponse } from '.'
import prisma from '../../../lib/db/prisma/index'

export type OpenPos = PurchaseOrders & {
    numItems: number | string
    PlanLoadId: number
    [x: string]: any
}

const getOpen = async (
    req: NextApiRequest__User,
    res: NextApiResponse<AllPoResponse | APIError>
): Promise<any> => {
    const where =
        req.user.role === 'SUPERADMIN'
            ? 'is not null'
            : `= ${req.user.vendorId}`

    const newOrders = await prisma.$queryRaw<OpenPos[]>(`
            select 
                po.PurchaseOrderId, 
                po.EntityOwnerId, 
                po.VendorId, 
                po.POLocationId, 
                po.POStatus, 
                po.PurchaseOrderNbr, 
                po.PurchaseOrderDate, 
                po.StoreNbr,
                po.ShipDt, 
                po.VendorCode, 
                po.VendorName, 
                po.VendorLocation, 
                po.BusinessUnit, 
                po.AccountNbr,
                po.PurchaseOrderDueDate, 
                po.PurchaseOrderReference, 
                po.PurchaseOrderLocation,
                po.PurchaseOrderNotify, 
                pl.LoadName, 
                pl.PlanLoadId, 
                pl.PurchaseOrderIndex, 
                COUNT(pod.ItemNbr) as numItems
            from PurchaseOrders po
            join PlanLoads pl
                on pl.PurchaseOrderId = po.PurchaseOrderId
            left join PurchaseOrderDetails pod
                on pod.PurchaseOrderId = po.PurchaseOrderId
            where po.VendorId ${where}
                and pl.LocationId in (1636, 10489, 10490)
            group by 
                po.PurchaseOrderId, 
                po.EntityOwnerId, 
                po.VendorId, 
                po.POLocationId, 
                po.POStatus,
                po.PurchaseOrderNbr, 
                po.PurchaseOrderDate, 
                po.StoreNbr,
                po.ShipDt, 
                po.VendorCode, 
                po.VendorName, 
                po.VendorLocation, 
                po.BusinessUnit, 
                po.AccountNbr,
                po.PurchaseOrderDueDate, 
                po.PurchaseOrderReference, 
                po.PurchaseOrderLocation,
                po.PurchaseOrderNotify, 

                pl.LoadName, 
                pl.PlanLoadId, 
                pl.PurchaseOrderIndex

            order by PurchaseOrderId`)

    newOrders.sort(
        (a, b) =>
            Date.parse(String(a.PurchaseOrderDueDate)) -
            Date.parse(String(b.PurchaseOrderDueDate))
    )

    newOrders.forEach((o, index) => {
        if (LOCKED_STATUS.includes(o.POStatus)) {
            newOrders.push(newOrders.splice(index, 1)[0])
        }
    })

    return res.json({
        metadata: {
            total: newOrders.length,
            start: 0,
            end: 10,
            count: 10,
        },
        orders: newOrders,
    })
}

export default withUser(getOpen)
