import { Request, Response, NextFunction } from 'express'
const winston = require('winston')

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

module.exports = {
  logger: (req: Request, res: Response, next: NextFunction) => {
    const incomingIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || null

    console.log(
      new Date(),
      req.method,
      req.originalUrl,
      '\n',
      'IP -> ' + incomingIp,
    )
    next()
  },
}
