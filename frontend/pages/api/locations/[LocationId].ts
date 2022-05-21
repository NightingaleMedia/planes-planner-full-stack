import { Locations } from '.prisma/client'
import withUser from 'lib/withUser'
import { NextApiRequest, NextApiResponse } from 'next'
import { APIError } from 'src/types/APIError'
import prisma from '../../../lib/db/prisma/index'

/**
 * @swagger
 * /api/locations:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */

const locationHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<Locations | APIError>
) => {
    try {
        let { LocationId } = req.query as any
        LocationId = Number(LocationId)

        const location = await prisma.locations.findUnique({
            where: {
                LocationId,
            },
        })

        return res.json(location)
    } catch (error) {
        return res.status(400).json({ message: 'Not found' })
    }
}

export default withUser(locationHandler)
