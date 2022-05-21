import prisma from 'lib/db/prisma/index'
import withUser from 'lib/withUser'
import { NextApiResponse } from 'next'
import { emailNotify } from 'pages/api/admin/services/emailNotify'
import {
    changeAllPlanLoadLocation,
    changePlanLoadLocation,
} from 'pages/api/plan-loads/services/changeLocation'
import { POStatuses, statusMap } from 'src/constants'
import { NextApiRequest__User } from 'src/types'
import { changeStatus } from '../services/changeStatus'

const changeStatusHandler = async (
    req: NextApiRequest__User,
    res: NextApiResponse<any>
): Promise<any> => {
    const { PurchaseOrderId } = req.query
    const data = req.body

    if (req.method === 'POST') {
        const { status, planLoadId } = data
        if (!status || !planLoadId) {
            return res.status(400).json({
                message: 'Either no status or plan load ID was provided',
            })
        }

        if (!Object.keys(POStatuses).includes(status)) {
            return res.status(400).json({
                message: 'Invalid Statuses',
                statuses: Object.keys(POStatuses),
            })
        }

        try {
            if (req.user.role !== 'SUPERADMIN') {
                throw { message: 'Unauthorized' }
            }
            const result = await changeStatus(PurchaseOrderId, status)
            changePlanLoadLocation(planLoadId, statusMap[result.data.POStatus])
            return res
                .status(result.status)
                .json({ message: result.message, ...result })
        } catch (error) {
            res.status(400)
            console.log(error)
            return res.json({ message: error.message })
        }
    } else {
        res.status(404).json({ message: 'Only post request accepted' })
    }
}

export default withUser(changeStatusHandler)
