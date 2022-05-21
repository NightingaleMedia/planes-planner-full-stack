'use-strict'
import { NextFunction, Request, Response } from 'express'
require('dotenv').config()
const express = require('express')
const app = express()
const helmet = require('helmet')
const { routes } = require('./routes')
const { cors } = require('./middleware/cors')
const { logger, log } = require('./services/logger')
const { ipAllow } = require('./middleware/ipAddress')
// TODO add correct middlewares
app.use(helmet())
app.use(express.json())
app.use(cors)
// app.use(ipAllow)
app.all('*', logger, (req: any, res: any, next: NextFunction) => {
  next()
})

// public routes
app.use('/', routes)

// send back a 404 error for any unknown api request
app.use((req: any, res: any, next: any) => {
  res.status(404)
  res.json({ message: 'Resource Not Found' })
})

// run logic
const run = async (port: number | string) => {
  app.listen(port, () => {
    console.log(`App is running on port ${port}`)
  })
}
run(process.env.PORT).catch((err) => {
  log.log({ level: 'error', data: err, type: 'run error' })

  throw err
})

module.exports = { express }
