import { PlanLoadShippingUnitDetails, PlanLoadShippingUnits } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { APIError } from 'src/types/APIError'
import prisma from '../../../../lib/db/prisma/index'

type PlanLoadDetailsResponse = {
   shippingUnits: PlanLoadShippingUnits[]
   shippingUnitDetails: PlanLoadShippingUnitDetails[]
}

const getPlanLoadByPo = async (
    req: NextApiRequest,
    res: NextApiResponse<PlanLoadDetailsResponse | APIError>
) => {
    let { planLoadId } = req.query as any

    if(!planLoadId){
        return res.status(400).send({message: 'Invalid Plan Load ID in PlanLoadQuery'})
    }
    planLoadId = parseInt(planLoadId)

    const units = await prisma.planLoadShippingUnits.findMany({
        where: {
            PlanLoadId: { equals: planLoadId },
        },
    })

    const details = await prisma.planLoadShippingUnitDetails.findMany({
        where: {
            PlanLoadShippingUnitId: units[0].PlanLoadShippingUnitId,
        },
    })
    res.json({
        shippingUnits: units,
        shippingUnitDetails: details,
    })
}

export default getPlanLoadByPo
