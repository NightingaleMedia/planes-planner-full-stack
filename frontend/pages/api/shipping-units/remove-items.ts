import { NextApiRequest, NextApiResponse } from 'next'
import { deleteItemFromSu } from './services/deleteItemFromSu'

type DeleteData = {
    id: number
    message: string
    [x: string]: any
}

const deleteItemsHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
): Promise<any> => {
    console.log(req.method, '/shipping-units/remove-items')
    const data = req.body
    if (req.method === 'DELETE') {
        const { planLoadShippingUnitId, itemNbr } = data
        if (!planLoadShippingUnitId || !itemNbr) {
            res.status(400)
            return res.json({
                message: 'No shipping unit ID or item number was provided',
            })
        }
        try {
            const result = await deleteItemFromSu(
                planLoadShippingUnitId,
                itemNbr
            )
            return res.status(result.status).json({ message: result.message })
        } catch (error) {
            res.status(400)
            console.log(error)
            return res.json({
                message: 'Something went wrong. Remove Items ln 96',
            })
        }
    } else {
        res.status(404).json({ message: 'Only delete request accepted' })
    }
}

export default deleteItemsHandler
