import { PurchaseOrders } from '.prisma/client'
import withUser from 'lib/withUser'
import type {  NextApiResponse } from 'next'
import { ApiUser, NextApiRequest__User } from 'src/types'
import { APIError } from 'src/types/APIError'
import prisma from '../../../../lib/db/prisma/index'
import { GetDetailsOnPo, PoDetail__Response } from './details'

export type Loads  = {
    PurchaseOrderId: number
    PurchaseOrderIndex: number
    PlanLoadId: number
    LoadName: string
}

export type POResponse = {
    purchaseOrder: PurchaseOrders
    details: PoDetail__Response[]
    numLoads: number
    Loads: Loads[]
}

export async function checkProtected(
    id: string | number,
    user: ApiUser,
    reject: () => any
) {
    if (user.role === 'SUPERADMIN') {
        return
    } else {
        const po = await prisma.purchaseOrders.findMany({
            where: {
                PurchaseOrderId: Number(id),
                VendorId: Number(user.vendorId),
            },
            select: {
                PurchaseOrderId: true,
            },
        })
        if (po.length === 0) {
            reject()
        } else return po[0]
    }
}
const getPo = async (
    req: NextApiRequest__User,
    res: NextApiResponse<POResponse | APIError>
) => {
    const id = Number(req.query.PurchaseOrderId)

    console.log(req.method, `/purchase-orders/${id}`)
    //
    const vendorId =
        req.user.role === 'SUPERADMIN' ? { not: null } : req.user.vendorId
    //
    const orders = await prisma.purchaseOrders.findMany({
        where: {
            PurchaseOrderId: id,
            VendorId: vendorId,
        },
    })

    const Loads = await prisma.planLoads.findMany({
        where:{
            PurchaseOrderId: id,
        },
        select: {
            PurchaseOrderId: true,
            PurchaseOrderIndex: true,
            PlanLoadId: true,
            LoadName: true,
            
        }
    })

    if (orders.length < 1) {
        return res
            .status(404)
            .json({ message: 'Could not find that purchase order.' })
    }
    const details = await GetDetailsOnPo(id)

    return res.json({ 
        purchaseOrder: orders[0], 
        details, 
        numLoads: Loads.length,
        Loads
    })
}

export default withUser(getPo)
