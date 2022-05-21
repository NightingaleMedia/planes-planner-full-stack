import prisma from '../../../../lib/db/prisma/index'

export const changePlanLoadLocation = async (planLoadId, locationId) => {
    console.log('change pl location: ', locationId)
    console.log('on load id: ', planLoadId)
    await prisma.planLoads.update({
        where: {
            PlanLoadId: Number(planLoadId),
        },
        data: {
            LocationId: Number(locationId),
        },
    })
}
export const changeAllPlanLoadLocation = async (
    purchaseOrderId,
    locationId
) => {
    console.log('change pl location: ', locationId)
    console.log('on po:', purchaseOrderId)
    await prisma.planLoads.updateMany({
        where: {
            // TODO change this to plan load ID
            PurchaseOrderId: Number(purchaseOrderId),
        },
        data: {
            LocationId: Number(locationId),
        },
    })
}
