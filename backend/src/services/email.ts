import { PurchaseOrders } from '@prisma/client'
const { log } = require('./logger')
const nodemailer = require('nodemailer')

export type Email = {
  from: string
  to: string
  subject: string
  text?: string
  html: any
}

const transport = nodemailer.createTransport({
  host: '10.35.23.36',
  port: 25,
  secure: false,
  auth: {
    user: 'smtpuser',
    pass: 's!mPL3m@il',
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  debug: true,
  logger: true,
})

class Mail {
  async send(email: Email) {
    log.log({ label: 'email', level: 'info', data: email })
    await transport.sendMail(email, function (error: any, response: any) {
      if (error) {
        console.log('Error in sending mail: ', error)
        log.log({ level: 'error', data: error, info: 'email_error' })
      } else {
        console.log('Email sent:', response)
        log.log({ level: 'info', data: response, info: 'email_success' })
      }
    })
  }
}

export const sendNewPassword = async (pass: string, email: string) => {
  log.log({
    label: 'email',
    level: 'info',
    data: `New Pass: ${pass} for email: ${email}`,
  })
  const mail = new Mail()

  const result = await mail.send({
    to: email,
    from: process.env.DEFAULT_EMAIL_FROM,
    subject: 'Reset Password Request',
    html: `
    <p>Hello, you have requested a new password, 
    please log in with this randomly generated password:<strong> ${pass}</strong> </p>
    <p>If you continue to have problems, please contact the planes administrator.</p>
    `,
  })
  return result
}

const purchaseOrderNotify = async (emailList: string[], po: PurchaseOrders) => {
  console.log(`Purchase order notify to: ${emailList}, from ${po}`)
  const mail = new Mail()
  const result = await mail.send({
    to: emailList.join(','),
    from: process.env.DEFAULT_EMAIL_FROM,
    subject: 'Purchase Order Status Change',
    html: `
    <pThis is an automated notification that the Purchase Order ${po.BusinessUnit} ${po.PurchaseOrderNbr} status has been changed to <strong>
    ${po.POStatus}</strong> </p>
    <br/>
    <p>To view the details of this order please go to <a href="${process.env.FRONTEND_URL}/orders/${po.PurchaseOrderId}">this link.</a></p>
    `,
  })
  return result
}

module.exports = { purchaseOrderNotify, sendNewPassword, mail: new Mail() }
