import withUser from 'lib/withUser'
import type {  NextApiResponse } from 'next'
import { emailNotify } from 'pages/api/admin/services/emailNotify'
import { QuickUnit } from 'pages/quick-ship/[purchaseOrderId]'
import {  NextApiRequest__User } from 'src/types'
import { APIError } from 'src/types/APIError'
import prisma from '../../../../lib/db/prisma/index'


export type Loads  = {
    [x: string]: any
}

const quickShipHandler = async (
    req: NextApiRequest__User,
    res: NextApiResponse<any | APIError>
) => {
    const  PlanLoadId  = Number(req.query.PlanLoadId)
    let units : QuickUnit[] = req.body.units

  
    if(!units ){
        return res.status(400).json({message: 'No units to finalize'})
    }

    let errors = units.map( u => {
        const errs = { ...u, errors: [] }
        if (Number(u.Weight) === 0) {
            errs.errors.push('Missing Weight!')
        }
        const lwh = [Number(u.Length), Number(u.Width), Number(u.Height)]
        if (lwh.includes(0)) {
            errs.errors.push('Length Width and Height required!')
        }
        if (errs.errors.length > 0) {
            return errs
        } else return null
    })

    errors = errors.filter(e => e)

    if(errors.length > 0){
        console.log(errors)
        return  res.status(400).json( errors )
    }
    const load = await prisma.planLoads.findUnique({
        where: {
            PlanLoadId,
        },
    
    })
    if(!load){
        res.status(404).send({message: 'No plan load.'})
    }
    
    // make each unit have a plan load id
    units.forEach(unit => unit.PlanLoadId = load.PlanLoadId)

    // delete any that do exist 
    const deleted = await prisma.planLoadShippingUnits.deleteMany({
        where: {
            PlanLoadId: load.PlanLoadId
        }
    })
    console.log({ deleted })
    try {
        // clean units
        units = units.reduce((arr, item) => {
            'index' in item && delete item.index
            'errors' in item && delete item.errors
            'selected' in item && delete item.selected
            return [...arr, item]
        },[])
        
        const allUnits =  await prisma.planLoadShippingUnits.createMany({
            data:[...units]
         })
         
         const firstUnit = await prisma.planLoadShippingUnits.findMany({
             where: {
                 PlanLoadId: load.PlanLoadId
             }
         }).then(units => units[0])

        const allItems = await prisma.purchaseOrderDetails.findMany({
            where: {
                PurchaseOrderId: load.PurchaseOrderId
            }
        })
 
        const allAddedUnits = [];
        await Promise.all(allItems.map(async u => {
            const addedUnit = await prisma.planLoadShippingUnitDetails.create({
                data: {
                    PlanLoadShippingUnitId: firstUnit.PlanLoadShippingUnitId,
                    ItemNbr: u.ItemNbr,
                    Qty: Number(u.ItemQty),
                }
            })
            allAddedUnits.push(addedUnit)
        }))

        // change plan load status

        const planLoad = await prisma.planLoads.update({
            where: {
                PlanLoadId, 
            },
            data: {
                LocationId: 10490
            }
        })


        const purchaseOrder = await prisma.purchaseOrders.update({
            where:{
                PurchaseOrderId: Number(planLoad.PurchaseOrderId)
            },
            data:{
                POStatus: 'readyToShipInFull'
            }
        })
        emailNotify(planLoad.PurchaseOrderId);
        
        return res.status(200).json({ planLoad, purchaseOrder })
    } catch (error) {
        console.log({ error })
       return  res.status(400).json({ message: error })
    }
}

export default withUser(quickShipHandler)
