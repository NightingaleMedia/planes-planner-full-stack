import {  Prisma } from '.prisma/client'
import withUser from 'lib/withUser'
import type {  NextApiResponse } from 'next'

import { NextApiRequest__User } from 'src/types'
import prisma from '../../../lib/db/prisma/index'
import {  Metadata__Response } from '../purchase-orders'
import { autoChangeStatus } from '../purchase-orders/autoChangeStatus'
import { createShippingUnit } from './services/createShippingUnit'
import { deleteShippingUnit } from './services/deleteShippingUnit'
import { getAllShippingUnits } from './services/getAllShippingUnits'
import { updateShippingUnit } from './services/updateShippingUnit'
type Data = {
    [x: string]: any
}

export type PlanLoadCreateRequest = {
    LicensePlateNbr: string
    PlanLoadId: number
    Width: string | number
    Length: string | number
    Height: string | number
    DimUnits: 'IN' | 'CM' | string
    WeightUnits: 'KG' | 'LBS' | string
    Weight: number
    Packaging: string
}

export const SHIPPING_SELECT = {
    PlanLoadShippingUnitId: true,
    PlanLoadId: true,
    Packaging: true,
    Weight: true,
    WeightUnits: true,
    Length: true,
    Width: true,
    Height: true,
    DimUnits: true,
    LicensePlateNbr: true,
}





const shippingUnits = async (
    req: NextApiRequest__User,
    res: NextApiResponse<Data>
): Promise<any> => {
    console.log(req.method, '/shipping-units')
    const data = req.body || null
    const { planLoadShippingUnitId } = data ?? req.query
    // need an ID for anything other than GET request
    if (req.method === 'PUT' || req.method === 'DELETE') {
        // get the id either from the body or from the query
        if (!planLoadShippingUnitId) {
            return res
                .status(400)
                .json({ message: 'No shipping unit ID was provided' })
        }
    }

    const vendorId =
        req.user.role === 'SUPERADMIN' ? {not: null} :req.user.vendorId

    switch (req.method) {
        case 'PUT':
      
            await updateShippingUnit(planLoadShippingUnitId, data.values)
                .then((result) => {
                    res.status(200)
                    return res.json({
                        message: 'Updated!',
                        shippingUnit: result,
                    })
                })
                .catch((err) => {
                    res.status(400)
                    console.error(err)
                    return res.json({ message: err.toString() })
                })

            break
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
        case 'DELETE':
            console.log('delete request')
            await deleteShippingUnit(Number(planLoadShippingUnitId))
                .then((result) => {
                    return res
                        .status(result.status)
                        .json({ message: result.message })
                })
                .catch((err) => {
                    res.status(err.status).json({ message: err.message })
                })
            break

        // basically get
        default:
            if(!req.query.count || !req.query.start){
                return res.status(400).json({message: 'You must include a count and start'})
            }
            if(Number(req.query.count) > 500){
                return res.status(400).json({message: 'Count must be below 500'})
            }
         

            await getAllShippingUnits(vendorId, req.query.count, req.query.start).then((loads) => {
                const meta: Metadata__Response = {
                    start: Number(req.query.start),
                    end: 0,
                    total: loads.length,
                    count: Number(req.query.count),
                }
                return res.json({ metadata: meta, loads })
            })
            break
    }
}

export default withUser(shippingUnits)
