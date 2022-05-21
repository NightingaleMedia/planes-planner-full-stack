import {  PurchaseOrders } from '.prisma/client'
import withUser from 'lib/withUser'
import type {  NextApiResponse } from 'next'
import {  NextApiRequest__User } from 'src/types'
import { APIError } from 'src/types/APIError'
import prisma from '../../../lib/db/prisma/index'

type Data = {
    start?: string | number
    entries: number
    [x: string]: any
}

export type Metadata__Response = {
    total: number
    start: any
    end: number
    count: number
}

export type AllPoResponse = {
    metadata?: Metadata__Response
    orders: PurchaseOrders[]
}

const getPo = async (
    req: NextApiRequest__User & Data,
    res: NextApiResponse<AllPoResponse | APIError>
): Promise<any> => {

 
    const where =
    req.user.role === 'SUPERADMIN'
        ? 'is not null'
        : `= ${req.user.vendorId}`

        
    // IF superadmin, use serverside pagination
    // if vendor just send full request

    const clientResult =
        await prisma.$queryRaw<PurchaseOrders[]>(`
            select po.*, pl.LoadName, pl.PlanLoadId, pl.PurchaseOrderIndex
            from PurchaseOrders po
            left join PlanLoads pl
            on pl.PurchaseOrderId = po.PurchaseOrderId
            where po.VendorId ${where}
            order by PurchaseOrderId
         
    `)

   return res.json({ orders: clientResult, metadata: {
       total: clientResult.length,
       start: clientResult.length,
       end: clientResult.length,
       count: clientResult.length,
   } })
}

export default withUser(getPo)
