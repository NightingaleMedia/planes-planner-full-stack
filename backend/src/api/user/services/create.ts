import { PrismaClient, User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { getRandomPassword } from '../../../services/RandomPass'
import { UserRequest } from '../../../types'
const { getRoleFromName } = require('./getRoleFromName')
const { mail } = require('../../../services/email')
const { encrypt } = require('./encrypt')
const { USER_RESPONSE } = require('../../../utils/constants')

const prisma = new PrismaClient()
const emailRegex = require('../../../utils/emailRegex')

const createUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  let requiredFields = ['email', 'vendorId', 'firstName', 'lastName']

  let { email, vendorId, firstName, lastName, role, sendEmail } = req.body

  // email and password required

  let missingFields = requiredFields.reduce((arr, item) => {
    if (!req.body[item]) {
      arr.push(item)
    }
    return arr
  }, [])

  if (missingFields.length > 0) {
    return res
      .status(406)
      .send({ message: `some fields are missing`, requiredFields })
  }

  // must match regex
  if (!email.match(emailRegex)) {
    return res.status(406).send({ message: `invalid email` })
  }

  // check that creator role can make that role
  if (!role) {
    console.log('no role')
    role = { name: 'VENDORUSER' }
  }

  if (role === 'SUPERADMIN' && req.user.Roles.RoleName !== 'SUPERADMIN') {
    return res
      .status(403)
      .json({ message: 'You are not authorized to create admins' })
      .send()
  }

  // check that vendorId is valid vendor
  vendorId = Number(vendorId)
  const vendor = await prisma.vendor.findUnique({
    where: {
      VendorId: vendorId,
    },
  })

  if (!vendor) {
    return res
      .status(400)
      .json({
        message:
          'Invalid Vendor ID, Either create a vendor first, or check the ID',
      })
      .send()
  }
  // sanitize email
  email = email.toLowerCase()
  // sanitize pw

  let password = getRandomPassword()

  // check that email is unique
  const dupUser = await prisma.user.findMany({
    where: {
      email,
    },
  })

  if (dupUser.length > 0) {
    delete dupUser[0].password
    return res
      .status(409)
      .json({
        message: 'Invalid email, that user already exists',
        user: dupUser[0],
      })
      .send()
  }
  // hash the pass

  const encryptedPassword = await encrypt(password)

  const roleId = await getRoleFromName(role)

  if (!roleId) {
    return res.status(404).json({ message: 'Invalid Role' })
  }
  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      password: encryptedPassword,
      email,
      Roles: {
        connect: {
          RoleId: Number(roleId),
        },
      },
      vendorId,
    },
    select: USER_RESPONSE,
  })

  if (sendEmail) {
    console.log(`Sending email to ${email} for new user creation.`)
    mail.send({
      to: email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: 'New User Creation',
      html: `
        <p>Hello, you have been set up with a new user account for vendor ${vendor.VendorName}, 
        please log in with this randomly generated password: <strong>${password}</strong> </p>
        <br/>
        <p>If you have problems, please contact the planes administrator.</p>
        `,
    })
  }

  return res.json(newUser)
}

module.exports = createUser
