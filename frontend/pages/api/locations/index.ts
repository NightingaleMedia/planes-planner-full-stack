import { Locations } from '.prisma/client'
import withUser from 'lib/withUser'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import { APIError } from 'src/types/APIError'
import prisma from '../../../lib/db/prisma/index'

/**
 * @swagger
 * /api/locations/:
 *   get:
 *     description: Returns all locaitons
 *     responses:
 *       200:
 *         description: hello world
 */

const locationHandler = async (
    req: NextApiRequest__User,
    res: NextApiResponse<Locations[] | APIError>
) => {
    if (req.user.role !== 'SUPERADMIN') {
        return res.status(400).json({ message: 'Unauthorized' })
    }
    const locations = await prisma.locations.findMany()
    return res.json(locations)
}

export default withUser(locationHandler)
