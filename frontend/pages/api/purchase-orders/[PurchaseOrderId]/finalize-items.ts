import { PlanLoadShippingUnits, Prisma } from '.prisma/client'
import withUser from 'lib/withUser'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import { GetAllDetails } from '../../plan-loads'
import prisma from '../../../../lib/db/prisma/index'
type Data = {
    [x: string]: any
}

export const checkPo = async PurchaseOrderId => {
    const poDetails = await prisma.purchaseOrderDetails
        .findMany({
            where: {
                PurchaseOrderId: Number(PurchaseOrderId),
            },
            select: {
                ItemNbr: true,
                ItemQty: true,
                FullFilledQty: true,
            },
        })
        .then(res =>
            res.filter(i => Number(i.FullFilledQty) < Number(i.ItemQty))
        )

    if (poDetails.length > 0) {
        const badItems = poDetails.reduce(
            (arr, item) => [...arr, item.ItemNbr],
            []
        )
        const confirm = `Item(s) ${badItems.join(
            ', '
        )} have quantities that are not accounted for.  Are you sure you want to short ship this unit?`
        throw confirm
    }
}

const finalizeItems = async (
    req: NextApiRequest__User,
    res: NextApiResponse<Data>
) => {
    const { PurchaseOrderId, planLoadId } = req.query
    if (!planLoadId) {
        return res
            .status(400)
            .send({ message: 'Plan load ID required in query.' })
    }
    try {
        // see if all items accounted for
        await checkPo(PurchaseOrderId)
    } catch (error) {
        return res.status(406).json({ message: error })
    }

    return res.status(200).send({ message: 'Purchase order approved!' })
}

export default withUser(finalizeItems)
