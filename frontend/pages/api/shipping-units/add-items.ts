import { Prisma } from '.prisma/client'
import { NextApiResponse } from 'next'
import { ApiUser, NextApiRequest__User } from 'src/types'
import prisma from '../../../lib/db/prisma/index'
import { autoChangeStatus } from '../purchase-orders/autoChangeStatus'

type ItemToAdd = {
    ItemNbr: string
    Quantity: number
    PurchaseOrderDetailId: string
    Qty: string
    HTSCode: string
    quantityToAdd: number
}

export type AddItemsReq = {
    items: ItemToAdd[]
    shippingUnitId: string
}
type Data = {
    [x: string]: any
}

// this will add an array of items to a shipping unit

const BatchAddItems = async (data: AddItemsReq, user: ApiUser) => {
    // for each item
    const batchAddArray: Prisma.PlanLoadShippingUnitDetailsCreateManyInput[] = data.items.map(
        i => ({
            PurchaseOrderDetailId: Number(i.PurchaseOrderDetailId),
            ItemNbr: i.ItemNbr,
            PlanLoadShippingUnitId: Number(data.shippingUnitId),
            Qty: i.quantityToAdd,
            HTSCode: i.HTSCode || null,
        })
    )

    // first check to see if that is a valid itemNbr
    // we have to see the corresponding purchase order detail and see
    let matchingArray = await Promise.all(
        batchAddArray.map(async i => {
            const result = await prisma.purchaseOrderDetails.findMany({
                where: {
                    ItemNbr: i.ItemNbr,
                    PurchaseOrderDetailId: i.PurchaseOrderDetailId,
                },
                select: {
                    ItemNbr: true,
                    FullFilledQty: true,
                    PurchaseOrderId: true,
                },
            })
            if (result.length > 0) {
                return result[0]
            }
        })
    )
    matchingArray = matchingArray.filter(i => i)
    //    this is assuring the 1 to 1 relationship
    if (matchingArray.length !== batchAddArray.length) {
        throw {
            status: 401,
            message:
                'You cannot add items that are not on the corresponding po detail',
            rest: {
                okItems: [...matchingArray],
            },
        }
    }

    try {
        let details
        Promise.all(
            batchAddArray.map(async i => {
                // last we need to see if this is just a quantity change or a new item
                //  -- see if that item nbr is on that shipping unit

                const su = await prisma.planLoadShippingUnitDetails.findMany({
                    where: {
                        PlanLoadShippingUnitId: i.PlanLoadShippingUnitId,
                        ItemNbr: i.ItemNbr,
                    },
                })
                //  if its not there
                if (su.length === 0) {
                    console.log('creating many')
                    details = await prisma.planLoadShippingUnitDetails.createMany(
                        {
                            data: i,
                        }
                    )
                } else {
                    // if it is there, then add the quantity
                    const oldquan = su[0].Qty
                    const quanToAdd = i.Qty + oldquan

                    console.log(
                        `Updating old: ${i.ItemNbr} from ${oldquan} to ${quanToAdd}`
                    )

                    if (quanToAdd === 0) {
                        console.log('Quantity is zero, deleting the item...')
                        details = await prisma.planLoadShippingUnitDetails.delete(
                            {
                                where: {
                                    PlanLoadShippingUnitDetailId:
                                        su[0].PlanLoadShippingUnitDetailId,
                                },
                            }
                        )
                    } else {
                        details = await prisma.planLoadShippingUnitDetails.updateMany(
                            {
                                where: {
                                    PlanLoadShippingUnitDetailId:
                                        su[0].PlanLoadShippingUnitDetailId,
                                },
                                data: {
                                    Qty: quanToAdd,
                                },
                            }
                        )
                    }
                }

                // then we handle the quantity for PO details
                const corres = matchingArray.find(
                    item => item.ItemNbr === i.ItemNbr
                )
                if (!corres.FullFilledQty) {
                    corres.FullFilledQty = new Prisma.Decimal(0)
                }
                const newQuan = corres.FullFilledQty.toNumber() + i.Qty
                const updatedPo = await prisma.purchaseOrderDetails.update({
                    where: {
                        PurchaseOrderDetailId: i.PurchaseOrderDetailId,
                    },
                    data: {
                        FullFilledQty: new Prisma.Decimal(newQuan),
                    },
                })
                autoChangeStatus(updatedPo.PurchaseOrderId)
            })
        )
        // here we change status based on number of items.

        return { status: 201, message: 'Added!', details }
    } catch (error) {
        throw {
            status: 401,
            message: error.toString(),
        }
    }
}

const itemsHandler = async (
    req: NextApiRequest__User,
    res: NextApiResponse<Data>
): Promise<any> => {
    console.log(req.method, '/shipping-units/add-items')
    const data = req.body
    console.log(`updating: ${data.items.length} items`)
    switch (req.method) {
        case 'POST':
            return await BatchAddItems(data, req.user)
                .then(result => {
                    res.status(result.status).json({
                        message: result.message,
                        details: result.details,
                    })
                })
                .catch(err => {
                    res.status(err.status).json({
                        message: err.message,
                        ...err.rest,
                    })
                })
        default:
            return res
                .status(404)
                .json({ message: 'Only post or delete request accepted' })
            break
    }
}

export default itemsHandler
