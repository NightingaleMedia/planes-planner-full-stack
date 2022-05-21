import { Request, Response, NextFunction } from 'express'
import { logEntry } from 'logger'
const winston = require('winston')

const log = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'planes-auth.log' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    winston.format.printf((info: logEntry) => {
      info.timestamp = new Date()
      if (!info.label) {
        info.label = 'none'
      }
      return `${info.level.toLocaleUpperCase()} | ${[info.timestamp]}: ${
        info.label
      }\ndata: ${JSON.stringify(info.data)}`
    }),
  ),
})

module.exports = {
  log,
  logger: (req: Request, res: Response, next: NextFunction) => {
    const incomingIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || null
    log.log({
      level: 'info',
      label: 'method',
      data: {
        date: new Date(),
        method: req.method,
        url: req.originalUrl,
        ip: incomingIp,
      },
    })

    next()
  },
}
