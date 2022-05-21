import withUser from 'lib/withUser'
import type {  NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import { APIError } from 'src/types/APIError'
import prisma from '../../../../lib/db/prisma/index'
import { PlanLoadQuery, PLAN_LOAD_QUERY } from '../services/planLoadQuery'

const planLoadHandler = async (
    req: NextApiRequest__User,
    res: NextApiResponse<PlanLoadQuery[] | APIError>
) => {
    const { purchaseOrderId } = req.query

    const where = req.user.role === 'SUPERADMIN' ? 'is not null' : `= ${req.user.vendorId}`
    const loads : PlanLoadQuery[] | [] = await prisma.$queryRaw(PLAN_LOAD_QUERY(purchaseOrderId, where))

    if(loads.length === 0 ){
        return res.status(404).json({message: 'Cannot find that plan load'})
    }

    res.json([...loads])
}

export default withUser(planLoadHandler)
