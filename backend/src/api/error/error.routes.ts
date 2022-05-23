import express, { Request, Response } from 'express'
const router = express.Router()
import { sendToWebMaster } from '../../services/email'

interface ErrorReq extends Request {
  body: {
    url: string
    message: any
  }
}
router.use('/error', async (req: ErrorReq, res: Response) => {
  await sendToWebMaster(req.body)
  res.status(200).send()
})

module.exports = router
