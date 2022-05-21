import { PlanLoadShippingUnits } from '.prisma/client'
import withUser from 'lib/withUser'
import { NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import prisma from '../../../../lib/db/prisma/index'

export const checkUnits = async (units: PlanLoadShippingUnits[]) => {
    const hasNone = await Promise.all(
        units.map(async u => {
            const errs = { ...u, errors: [] }
            if (Number(u.Weight) === 0) {
                errs.errors.push('Missing Weight!')
            }
            const lwh = [Number(u.Length), Number(u.Width), Number(u.Height)]
            if (lwh.includes(0)) {
                errs.errors.push('Length Width and Height required!')
            }

            const details = await prisma.planLoadShippingUnitDetails.findMany({
                where: {
                    PlanLoadShippingUnitId: u.PlanLoadShippingUnitId,
                },
            })

            if (details.length === 0) {
                errs.errors.push(
                    'You have no items on this unit.  Either delete it or add something to ship.'
                )
            }
            if (errs.errors.length > 0) {
                return errs
            } else return { PlanLoadId: null }
        })
    ).then(res => res.filter(u => u.PlanLoadId !== null))
    console.log({ hasNone })
    // throw {status: 406, message: loadAndItems}
    if (hasNone.length > 0) {
        throw hasNone
    } else return
}

const finalizeUnits = async (
    req: NextApiRequest__User,
    res: NextApiResponse<any>
) => {
    const { planLoadId } = req.query

    if (!planLoadId) {
        return res
            .status(400)
            .send({ message: 'Plan load ID required in query.' })
    }

    // check if at least one unit exists
    const units = await prisma.planLoadShippingUnits.findMany({
        where: {
            PlanLoadId: { equals: Number(planLoadId) },
        },
    })

    if (!units || units.length === 0) {
        return res.status(404).send({
            message: 'You cannot finalize this shipment, there are no units.',
        })
    }

    try {
        // make sure each unit has weight and measure
        await checkUnits(units)
    } catch (error) {
        return res.status(406).send(error)
    }

    return res.status(200).send({ message: 'Approved' })
}

export default withUser(finalizeUnits)
