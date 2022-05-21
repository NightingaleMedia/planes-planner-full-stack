import withUser from 'lib/withUser'
import type {  NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import { APIError } from 'src/types/APIError'
import {  Metadata__Response } from '..'
import prisma from '../../../../lib/db/prisma/index'

export type PoDetail__Response = {
    PurchaseOrderDetailId: any
    PurchaseOrderId: any
    LineNbr: any
    ItemNbr: any
    ItemDesc: any
    ItemQty: any
    FullFilledQty: any
    ItemAmt: any
    ItemUOM: any
}

export const GetDetailsOnPo = async (
    purchaseOrderId: number
): Promise<PoDetail__Response[]> => {
    return await prisma.purchaseOrderDetails.findMany({
        where: {
            PurchaseOrderId: purchaseOrderId,
        },
        select: {
            PurchaseOrderDetailId: true,
            PurchaseOrderId: true,
            LineNbr: true,
            ItemNbr: true,
            ItemDesc: true,
            ItemQty: true,
            FullFilledQty: true,
            ItemAmt: true,
            ItemUOM: true,
        },
    })
}

export type GetPoDetails__Response = {
    metadata: Metadata__Response
    details: PoDetail__Response[]
    purchaseOrder: {
        BusinessUnit: string
        PurchaseOrderNbr: string
        PurchaseOrderId: number
    }
}

const getPoDetails = async (
    req: NextApiRequest__User,
    res: NextApiResponse<GetPoDetails__Response | APIError>
): Promise<void> => {
    const { PurchaseOrderId } = req.query as any
    const id: number = parseInt(PurchaseOrderId)
    // make sure ID is valid for this vendor
    const where = req.user.role === 'SUPERADMIN' ?{
        PurchaseOrderId: id,
     
    } :{
        PurchaseOrderId: id,
        VendorId: req.user.vendorId,
    }

    const correspondingPo = await prisma.purchaseOrders.findMany({
        where,
        select: {
            BusinessUnit: true,
            PurchaseOrderId: true,
            PurchaseOrderNbr: true,
        }
    })
    if (correspondingPo.length === 0) {
        res.status(401)
        return res.json({ message: 'That po is not under your name' })
    }

    const details = await GetDetailsOnPo(id)
    res.json({
        metadata: {
            start: 0,
            end: 9999,
            count: details.length,
            total: details.length,
        },
        details,
        purchaseOrder: correspondingPo[0],

    })
}

export default withUser(getPoDetails)
