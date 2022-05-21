import prisma from '../../../../lib/db/prisma/index'

export async function emailNotify(purchaseOrderId) {
    console.log('Running email notify...', purchaseOrderId)
    const emailList = await prisma.purchaseOrders.findUnique({
        where: {
            PurchaseOrderId: Number(purchaseOrderId),
        },
        select: {
            PurchaseOrderNotify: true,
        },
    })

    const emailListArray = JSON.parse(emailList.PurchaseOrderNotify)

    if (emailListArray && emailListArray.length > 0) {
        return await fetch(
            process.env.NEXT_PUBLIC_ADMIN_URL + '/admin/purchase-order-notify',
            {
                headers: {
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    emails: emailList.PurchaseOrderNotify,
                    purchaseOrderId,
                }),
            }
        ).then(res => res.json())
    }
}

// export default async function testIt(req, res) {
//     const result = await emailNotify(24735)
//     return res.json({ result })
// }
