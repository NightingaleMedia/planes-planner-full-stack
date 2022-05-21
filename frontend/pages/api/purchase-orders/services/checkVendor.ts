import { ApiUser } from 'src/types'
import prisma from '../../../../lib/db/prisma/index'

export type Loads = {
    number: number
    ids: any[]
}

export async function checkVendor(user: ApiUser, id: string | number) {
    if (user.role === 'SUPERADMIN') {
        return true
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
            return false
        } else return true
    }
}
