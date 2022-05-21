import {
    PlanLoads,
    PlanLoadShippingUnitDetails,
    PlanLoadShippingUnits,
} from '.prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PurchaseOrderDetails } from 'src/types'
import prisma from '../../../lib/db/prisma/index'
import { createShippingUnit } from '../shipping-units/services/createShippingUnit'
type Data = {
    purchaseOrderId?: string | number
    [x: string]: any
}

const PLANLOAD_SELECT = {
    PlanLoadId: true,
    PlanId: true,
    LocationId: true,
    LoadName: true,
    ShortLoadName: true,
    PurchaseOrderId: true,
    PurchaseOrderIndex: true,
    BusinessUnit: true,
    PurchaseOrderNbr: true,
    VendorId: true,
    VendorNbr: true,
    VendorName: true,
}
declare interface ShippingUnitsWithItems extends PlanLoadShippingUnits {
    items: PlanLoadShippingUnitDetails[] | []
}

export type PlanLoadItemResponse = PlanLoadShippingUnits & {
    items: PlanLoadShippingUnitDetails[] | []
}

export type PlanLoadResponse = {
    planLoad: PlanLoads
    planLoadShippingUnits: ShippingUnitsWithItems[]
    correspondingPoDetails: PurchaseOrderDetails[]
}

export const GetAllDetails =async (units: PlanLoadShippingUnits[]) => {
  return  await Promise.all(
        units.map(async (unit): Promise<PlanLoadItemResponse> => {
            const details: PlanLoadShippingUnitDetails[] | [] =
                await prisma.planLoadShippingUnitDetails.findMany({
                    where: {
                        PlanLoadShippingUnitId: unit.PlanLoadShippingUnitId,
                    },
                })
            return { ...unit, items: details }
        })
    )
}
// return plan load by purchase order id
const GetAllOnPlanLoad = async (purchaseOrderId: string, index: number) => {
    if (!purchaseOrderId) {
        throw { status: 401, message: 'No purchase order ID is specified' }
    }
    try {
        const planLoad = await prisma.planLoads.findMany({
            where: {
                PurchaseOrderId: {
                    equals: Number(purchaseOrderId),
                },
                PurchaseOrderIndex: {
                    equals: Number(index)
                }
            },
            select: { ...PLANLOAD_SELECT },
        })
        if (!planLoad || planLoad.length === 0) {
            throw {
                status: 404,
                message: 'No plan load',
            }
        }
        const shippingUnits = await prisma.planLoadShippingUnits.findMany({
            where: {
                PlanLoadId: {
                    equals: planLoad[0].PlanLoadId,
                },
            },
        })
        const result: PlanLoadItemResponse[] = await GetAllDetails(shippingUnits)
        const correspondingPoDetails =
            await prisma.purchaseOrderDetails.findMany({
                where: {
                    PurchaseOrderId: planLoad[0].PurchaseOrderId,
                },
                select: {
                    PurchaseOrderDetailId: true,
                    ItemNbr: true,
                    ItemAmt: true,
                    ItemDesc: true,
                    ItemQty: true,
                    FullFilledQty: true,
                    HTSItem: true,
                },
                orderBy:{
                    ItemNbr: 'desc',
                }
            })

 
        return {
            planLoad: planLoad[0],
            planLoadShippingUnits: result,
            correspondingPoDetails,
        }
    } catch (error) {
        if (error) {
            throw error
        }
    }
}

const planLoadHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
): Promise<any> => {
    console.log(req.method, req.url)

    const { purchaseOrderId } = req.query as any
    let { index } = req.query as any

    if(!index){
        index = 1
    }
    if (!purchaseOrderId) {
        return res
            .status(400)
            .send({ message: 'No purchase order id specified.' })
    }

    const data = req.body || null
    switch (req.method) {
        case 'POST':
            await createShippingUnit(data)
                .then((result) => {
                    return res.status(201).json({
                        message: result.message,
                        shippingUnit: result.shippingUnit,
                    })
                })
                .catch((err) => {
                    console.log('err post: ', err)
                    return res.status(err.status).json({ message: err.message })
                })
            break
        case 'GET':
            return await GetAllOnPlanLoad(purchaseOrderId, index)
                .then((result) => {
                    res.json(result)
                })
                .catch((err) =>
                    res.status(err.status).json({ message: err.message })
                )
        default:
            return res.status(404).json({ message: 'No endpoint for that.' })
    }
}

export default planLoadHandler
