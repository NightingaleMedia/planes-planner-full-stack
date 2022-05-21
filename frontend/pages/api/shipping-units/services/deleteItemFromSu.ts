import prisma from '../../../../lib/db/prisma/index'
import { autoChangeStatus } from '../../purchase-orders/autoChangeStatus'
export const deleteItemFromSu = async (unitId, itemNbr) => {
    itemNbr = String(itemNbr)
    // find the shipping unit
    let unit
    try {
        const {
            PlanLoadShippingUnitId,
        } = await prisma.planLoadShippingUnits.findUnique({
            where: {
                PlanLoadShippingUnitId: Number(unitId),
            },
        })

        if (!PlanLoadShippingUnitId) throw 'No unit found'

        const items = await prisma.planLoadShippingUnitDetails.findMany({
            where: {
                ItemNbr: itemNbr,
                PlanLoadShippingUnitId: PlanLoadShippingUnitId,
            },
        })

        if (items.length === 0) throw 'No item found'
        const item = items[0]
        console.log('Deleting item ', +item)

        // update the purchaseOrderDetailTable

        const {
            FullFilledQty,
            PurchaseOrderDetailId,
            PurchaseOrderId,
        } = await prisma.purchaseOrderDetails.findUnique({
            where: {
                PurchaseOrderDetailId: item.PurchaseOrderDetailId,
            },
        })

        // add it back to not fulfilled
        const newQty = Number(FullFilledQty) - item.Qty

        await prisma.purchaseOrderDetails.update({
            where: {
                PurchaseOrderDetailId,
            },
            data: {
                FullFilledQty: newQty,
            },
        })
        autoChangeStatus(PurchaseOrderId)

        await prisma.planLoadShippingUnitDetails.delete({
            where: {
                PlanLoadShippingUnitDetailId: item.PlanLoadShippingUnitDetailId,
            },
        })

        return { status: 200, message: `Deleted item ${itemNbr}`, unit }
    } catch (error) {
        throw { status: 400, message: error }
    }
}
