import prisma from '../../../../lib/db/prisma/index'
export const getAllShippingUnits = async (vendorId, count, start) => {
    const loads = await prisma.planLoads.findMany({
        where: {
            VendorId: vendorId,
        },
        select: {
            PlanId: true,
            PlanLoadId: true,
            LocationId: true,
            LoadName: true,
            PurchaseOrderId: true,
            BusinessUnit: true,
            VendorId: true,
            PlanLoadItems: true,
        },
        take: Number(count),
        skip: Number(start),
    })

    return loads
}
