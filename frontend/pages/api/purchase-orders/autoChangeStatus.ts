import { Prisma, PurchaseOrderDetails, PurchaseOrders } from '.prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db/prisma/index'
import { emailNotify } from '../admin/services/emailNotify'

export const autoChangeStatus = async (purchaseOrderId) => {
    console.log('Auto change status for ' + purchaseOrderId)
    const po: PurchaseOrders = await prisma.purchaseOrders.findUnique({
        where: {
            PurchaseOrderId: purchaseOrderId,
        },
    })

    const details: PurchaseOrderDetails[] =
        await prisma.purchaseOrderDetails.findMany({
            where: {
                PurchaseOrderId: purchaseOrderId,
            },
        })

    const hasItems = details.filter((d) => Number(d.FullFilledQty) > 0)
    const updatedStatus = hasItems.length > 0 ? 'inprogress' : 'new'

    await prisma.purchaseOrders.update({
        where: {
            PurchaseOrderId: purchaseOrderId,
        },
        data: {
            POStatus: updatedStatus,
        },
    })

    emailNotify(purchaseOrderId);

    // if any of the items have > 1 FullFilledQty then mark at is in progress

    // if not then mark it as new
}
