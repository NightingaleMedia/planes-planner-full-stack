import withUser from 'lib/withUser'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import prisma from '../../../lib/db/prisma/index'
type Data = {
    [x: string]: any
}

const getVendors = async (req: NextApiRequest__User, res: NextApiResponse<Data>) => {
    if (req.user.role !== 'SUPERADMIN') {
        return res.status(401).json({ message: 'unauthorized' })
    }
    if (req.method !== 'GET') {
        return res.status(404).json({ message: 'not found' })
    }

    let { start, count } = req.query as { start: string; count: string }
    if (!start) start = '0'
    if (!count) count = '10'

    const vendors = await prisma.vendors.findMany({
        select: {
            VendorId: true,
            VendorName: true,
            VendorCode: true,
        },
        take: Number(count),
        skip: Number(start)
    })

    return res.json({
        meta: {
            results: vendors.length,
        },

        vendors,
    })
}

export default withUser(getVendors)
