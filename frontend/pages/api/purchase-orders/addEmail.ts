import { NextApiRequest, NextApiResponse } from 'next'
import { addEmailNotify } from './services/addEmailNotify'

const addEmail = async (req: NextApiRequest, res: NextApiResponse) => {
    const { purchaseOrderId, emailArray } = req.body

    console.log(req.body)
    if (!purchaseOrderId || !emailArray) {
        return res
            .status(400)
            .send({ message: 'Email array and PO ID are required' })
    }
    try {
        const updated = await addEmailNotify(purchaseOrderId, emailArray)
        return res
            .status(200)
            .send({
                message: `Updated Purchase Order ${updated.PurchaseOrderId}`,
            })
    } catch (error) {
        console.log('Add email error: ', error)
        res.status(400).send({ message: error })
    }
}

export default addEmail
