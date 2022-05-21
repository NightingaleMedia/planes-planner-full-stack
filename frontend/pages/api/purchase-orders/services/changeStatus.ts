import prisma from 'lib/db/prisma/index'
import { emailNotify } from 'pages/api/admin/services/emailNotify'
import {
    changeAllPlanLoadLocation,
    changePlanLoadLocation,
} from 'pages/api/plan-loads/services/changeLocation'

export async function changeStatus(poId, newStatus) {
    console.log('Changing status baby...', poId, newStatus)

    try {
        const updated = await prisma.purchaseOrders.update({
            where: {
                PurchaseOrderId: Number(poId),
            },
            data: {
                POStatus: newStatus,
            },
        })

        emailNotify(poId)
        return { status: 200, message: 'Updated!', data: updated }
    } catch (error) {
        throw { status: 400, message: error }
    }
}
