const exJwt = require('express-jwt')
import { NextFunction, Request, Response } from 'express'
import { UserRequest } from '../types'
const jwtMw = [
  exJwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
  }),
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('jwt auth err:', err.status)
    res.status(err.status).json(err)
  },
]

module.exports = {
  jwt: jwtMw,
  onlySuperAdmin: [
    jwtMw,
    (req: UserRequest, res: Response, next: NextFunction) => {
      console.log('Only super admin middleware')
      if (!req.user || req.user.Roles.RoleName !== 'SUPERADMIN') {
        return res.sendStatus(401)
      } else {
        next()
      }
    },
  ],
  onlyAdmin: [
    jwtMw,
    (req: UserRequest, res: Response, next: NextFunction) => {
      if (!['SUPERADMIN', 'VENDORADMIN'].includes(req.user.Roles.RoleName)) {
        return res.sendStatus(401)
      } else {
        next()
      }
    },
  ],
}
