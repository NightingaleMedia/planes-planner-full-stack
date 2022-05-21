import withUser from 'lib/withUser'
import { NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import prisma from '../../../lib/db/prisma/index'

const getNameFromId = async (id: number) => {
    return await prisma.vendors.findUnique({
        where: {
            VendorId: Number(id),
        },
        select: {
            VendorName: true,
            VendorLongName: true,
        },
    })
}

const shippingUnits = async (
    req: NextApiRequest__User,
    res: NextApiResponse<any>
): Promise<any> => {
    switch (req.method) {
        case 'GET':
            try {
                const { VendorName, VendorLongName } = await getNameFromId(
                    req.user.vendorId
                )
                return res.send({ VendorName, VendorLongName })
            } catch (error) {
                return res.status(400).json({ message: error })
            }
        default:
            return res.status(404).json({ message: 'not found' })
    }
}

export default withUser(shippingUnits)
