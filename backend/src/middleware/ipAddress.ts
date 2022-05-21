import { Request, NextFunction, Response } from 'express'
const { IP_ALLOW_LIST } = require('../config')

module.exports = {
  ipAllow: async (req: Request, res: Response, next: NextFunction) => {
    const incomingIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || null

    if (IP_ALLOW_LIST.includes(incomingIp)) {
      next()
    } else {
      // Invalid ip
      const err = 'Bad IP: ' + req.socket.remoteAddress
      console.log(err)
      return res.status(401).json({ message: 'Unauthorized' })
    }
  },
}
