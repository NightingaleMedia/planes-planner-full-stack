import { PrismaClient } from '@prisma/client'
import { Response } from 'express'
import { UserRequest } from '../../../types'
const { getRandomPassword } = require('../../../services/RandomPass')
const email = require('../../../services/email')
const bcrypt = require('bcrypt')
const { checkPass } = require('../services/checkPass')
const { createPass } = require('../services/createPass')
const { updatePass } = require('../services/updatePass')
const prisma = new PrismaClient()

const confirmPass = async (req: UserRequest, res: any) => {
  let { oldPassword } = req.body
  let { email } = req.user

  console.log(req.user)
  // email and password required
  if (!email || !oldPassword) {
    return res
      .status(406)
      .send({ message: `email and oldPassword are required` })
  }

  // password
  oldPassword = oldPassword.toString()
  checkPass({ email, password: oldPassword })
    .then((result: any) => {
      // if successful
      console.log('verified password')
      return res.status(200).send({ message: 'verified' })
    })
    .catch((err: any) => {
      res.status(401)
      return res.json({ message: err })
    })
}

// only that person can change their password
// if you want an admin to do it, then use the 'user' route
const changePass = async (req: UserRequest, res: Response) => {
  let { password, newPassword } = req.body
  const idOfCaller = req.user.id
  // email and password required
  console.log(req.body)
  if (!password || !newPassword) {
    return res
      .status(406)
      .send({ message: `Username, pasword and new password are required.` })
  }

  // password
  password = password.toString()
  newPassword = newPassword.toString()
  // figure out who the user is that is trying to change
  const userForChangePw = await prisma.user.findUnique({
    where: {
      id: idOfCaller,
    },
  })

  if (!userForChangePw) {
    res.status(401)
    return res.json({ message: 'Not a valid user' })
  }

  const oldPwConfirm = await bcrypt.compare(password, userForChangePw.password)

  if (!oldPwConfirm) {
    res.status(401)
    return res.json({ message: 'Invalid old password' })
  }

  newPassword = await createPass(newPassword)
  try {
    await updatePass(userForChangePw.id, newPassword)
    console.log('updated password for:', userForChangePw.email)
    return res.status(201).send({
      message: `Success updating password for ${userForChangePw.email}`,
    })
  } catch (error) {
    res.status(400).send({ message: error })
  }
}

const getMe = async (req: UserRequest, res: any) => {
  let companyName = (await prisma.vendor
    .findMany({
      where: {
        VendorCode: String(req.user.vendorId),
      },
      select: {
        VendorName: true,
      },
    })
    .then((res) => res[0])) as any

  if (!companyName) {
    companyName = ''
  } else {
    companyName = String(companyName.VendorName)
  }
  const result = { ...req.user, companyName }

  return res.send(result)
}

module.exports = {
  changePass,
  confirmPass,
  getMe,
}
