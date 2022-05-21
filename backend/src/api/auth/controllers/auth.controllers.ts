import { Request, Response } from 'express'
import { User } from '@prisma/client'
const { PrismaClient } = require('@prisma/client')
import { encrypt } from '../../user/services/encrypt'
import { sendNewPassword } from '../../../services/email'
import { getRandomPassword } from '../../../services/RandomPass'
import { UserRequest } from '../../../types'
const { USER_RESPONSE } = require('../../../utils/constants')
const { createApiJwt } = require('../services/createJwt')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

const SELECT = {
  id: true,
  vendorId: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  preferences: true,
  //  we need this check the password
  password: true,
}

const login = async (req: any, res: any) => {
  // need a username and password or a userID
  let { email, password, id } = req.body

  if (!password) {
    return res
      .status(400)
      .json({ message: `Please provide Email or ID and password` })
  }

  if (!email && !id) {
    return res
      .status(400)
      .json({ message: `Please provide Email or ID and password` })
  }

  password = password.toString()
  email = email.toLowerCase()
  // first find the user by id or email
  let user = null
  if (id) {
    user = await prisma.user.findUnique({ where: id, select: SELECT })
  } else {
    user = (await prisma.user
      .findMany({
        where: {
          email,
        },
        // select: SELECT, // we need password to check it
        include: {
          Roles: true,
        },
      })
      .then((res: User[]) => res[0])) as any
  }
  // if no user
  if (!user || user === null) {
    return res.status(404).json({
      message: 'No user matches that id or email provided. Please try again',
    })
  }
  // check yo password
  const passCheck = await bcrypt.compare(password, user.password)

  if (!passCheck) {
    return res.status(401).json({
      message: 'Invalid username or password',
    })
  } else {
    // we don't want to send that

    // const vendorInfo = await prisma.vendor
    //   .findMany({
    //     where: {
    //       VendorId: Number(user.vendorId),
    //     },
    //     select: {
    //       VendorName: true,
    //     },
    //   })
    //   .then((res: any) => res[0])

    const roleInfo = await prisma.roles.findUnique({
      where: {
        RoleId: user.role,
      },
    })
    delete user.password
    // transform it for the response
    user.role = roleInfo.RoleName
    const token = createApiJwt(user)
    // user.companyName = vendorInfo?.VendorName || null
    return res.json({ jwt: token, user })
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  console.log('new password request')
  const { email } = req.body
  if (!email) {
    console.log('No email supplied...')
    return res.status(200).send()
  }
  let user
  let userReq = await prisma.user.findMany({
    where: {
      email: email,
    },
  })

  if (userReq.length === 0) {
    console.log('no user found for ', email)
    return res.status(200).send()
  } else {
    user = userReq[0]
  }
  const newPass = getRandomPassword()

  // set that as the new one

  const newPassEncrypt = await encrypt(newPass)

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: newPassEncrypt,
    },
  })

  sendNewPassword(newPass, user.email).catch((err) => {
    console.log('Send mail error: ', err)
  })

  return res.status(200).send({ message: 'ok' })
}

module.exports = {
  login,
  register: '',
  forgotPassword,
  verify: async (req: any, res: any) => {
    const bearerHeader = req.headers['authorization']
    if (!bearerHeader) {
      return res.sendStatus(403)
    }
    const token = bearerHeader.split(' ')[1]
    try {
      const user = await jwt.verify(token, process.env.TOKEN_SECRET)
      return res.json({ jwt: token, user })
    } catch (error) {
      console.log('JWT Error: ', error)
      res.status(401)
      res.json({ message: 'Unauthorized' })
    }
  },
}
