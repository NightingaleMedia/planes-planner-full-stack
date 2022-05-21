import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'
import { ApiUser, NextApiRequest__User } from 'src/types'

const withUser = handler => {
    return async (req: NextApiRequest__User, res) => {
        try {
            const authHeader = req.headers.authorization
            const token = authHeader.substring(7, authHeader.length)
            const theUser: ApiUser = await jwt.verify(
                token,
                process.env.JWT_SECRET
            )
            req.user = theUser

            console.log(
                `Authenicated request from: ${theUser.role} ${theUser.email}`
            )
            return handler(req, res)
        } catch (error) {
            console.log('Auth Error: ', error)
            return res.status(401).send({ message: 'Unauthorized', error })
        }
    }
}

export default withUser
