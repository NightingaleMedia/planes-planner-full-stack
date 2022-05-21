import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db/prisma/index'

const getSingleUnit = async (id) => {
    return await prisma.planLoadShippingUnits.findUnique({
        where: {
            PlanLoadShippingUnitId: Number(id),
        },
    })
}
const getOneShippingUnit = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
): Promise<any> => {
    console.log(req.method, '/shipping-units/[PlanLoadShippingUnitId]')
    const { PlanLoadShippingUnitId } = req.query
    if (!PlanLoadShippingUnitId) {
        res.status(400).json({
            message: 'You must supply a PlanLoadShippingUnitId',
        })
    }

    switch (req.method) {
        case 'GET':
            try {
                const unit = await getSingleUnit(PlanLoadShippingUnitId)
                return res.json( unit )
            } catch (error) {
                return res.status(400).json({ error })
            }
        default:
            return res.status(404).send('Not found')
            break
    }
}

export default getOneShippingUnit
