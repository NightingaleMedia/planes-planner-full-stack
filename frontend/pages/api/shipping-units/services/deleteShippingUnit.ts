import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/db/prisma/index'
import { autoChangeStatus } from '../../purchase-orders/autoChangeStatus'

export const deleteShippingUnit = async id => {
    // mark those items as not fulfilled on the purchase order details
    try {
        // cascade delete the item details
        //  get all the items on that shipping Unit#
        const items = await prisma.planLoadShippingUnitDetails.findMany({
            where: {
                PlanLoadShippingUnitId: Number(id),
            },
        })

        Promise.all(
            items.map(async i => {
                const {
                    FullFilledQty,
                    PurchaseOrderId,
                } = await prisma.purchaseOrderDetails.findUnique({
                    where: {
                        PurchaseOrderDetailId: i.PurchaseOrderDetailId,
                    },
                })
                let newQuan = FullFilledQty.toNumber() - i.Qty
                newQuan = newQuan <= 0 ? 0 : newQuan

                await prisma.purchaseOrderDetails.update({
                    where: {
                        PurchaseOrderDetailId: i.PurchaseOrderDetailId,
                    },
                    data: {
                        FullFilledQty: new Prisma.Decimal(newQuan),
                    },
                })
                autoChangeStatus(PurchaseOrderId)
            })
        )
        await prisma.planLoadShippingUnitDetails.deleteMany({
            where: {
                PlanLoadShippingUnitId: { equals: Number(id) },
            },
        })
        await prisma.planLoadShippingUnits.delete({
            where: {
                PlanLoadShippingUnitId: Number(id),
            },
        })
        return { status: 202, message: `Deleted Shipping Unit#: ${id}` }
    } catch (error) {
        throw { status: 400, message: error.toString() }
    }
}
