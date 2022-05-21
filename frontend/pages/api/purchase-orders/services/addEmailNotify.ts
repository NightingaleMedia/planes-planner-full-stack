import { PurchaseOrders } from '.prisma/client'
import prisma from '../../../../lib/db/prisma/index'

export const addEmailNotify = async (purchaseOrderId, emailArray) => {
    const po: PurchaseOrders = await prisma.purchaseOrders.findUnique({
        where: {
            PurchaseOrderId: purchaseOrderId,
        },
    })

    const emails = JSON.parse(po.PurchaseOrderNotify || '[]')

    console.log('Add emails notify: ' + purchaseOrderId, emailArray)

    emails.push(...emailArray)

    console.log('emails: ', emails)

    const newEmails = [...new Set(emails)]

    const updated = await prisma.purchaseOrders.update({
        where: {
            PurchaseOrderId: purchaseOrderId,
        },
        data: {
            PurchaseOrderNotify: JSON.stringify(newEmails),
        },
    })
    return updated
}
