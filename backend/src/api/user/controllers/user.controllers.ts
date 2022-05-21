import { PrismaClient, User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { USER_RESPONSE } from '../../../../src/utils/constants'
import { UserRequest } from '../../../types'
import { getRandomPassword } from '../../../services/RandomPass'
import { encrypt } from '../services/encrypt'
import { sendNewPassword } from '../../../services/email'
const prisma = new PrismaClient()

type UserQuery = {
  UserId: number
  VendorId: null
  FirstName: string
  LastName: string
  Email: string
  RoleId: number
  VendorLongName: string
  VendorName: string
  RoleName: string
}

const findAll = async (req: UserRequest, res: Response, next: NextFunction) => {
  // TODO
  let users: UserQuery[]
  switch (req.user.Roles.RoleName) {
    // if its vendor admin just do that vendor
    case 'VENDORADMIN':
      users = await prisma.$queryRaw`
      select u.UserId, u.VendorId, u.FirstName, u.LastName, u.Email, u.RoleId, v.VendorId, v.VendorLongName, v.VendorName, v.VendorCode, r.RoleName
      from Users u
      left join Vendors v
      on v.VendorId = u.VendorId
      left join Roles r 
      on r.RoleId = u.RoleId
      where u.VendorId = ${req.user.vendorId}
      `

      break
    // if its super admin, find all
    case 'SUPERADMIN':
      users = await prisma.$queryRaw`
      select u.UserId, u.VendorId, u.FirstName, u.LastName, u.Email, u.RoleId, v.VendorId, v.VendorLongName, v.VendorName, v.VendorCode, r.RoleName
      from Users u
      left join Vendors v
      on v.VendorId = u.VendorId
      left join Roles r 
      on r.RoleId = u.RoleId
      `
      break
    default:
      return res.status(404).json({ message: 'No users found' })
  }
  users = users.map((u) => ({ id: u.UserId, ...u }))
  return res.json({ users })
}

const findOne = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { id } = req.params
  const user: any = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    select: USER_RESPONSE,
  })
  if (!user) {
    return res.sendStatus(404)
  }
  if (
    user.vendorId !== req.user.vendorId &&
    req.user.Roles.RoleName !== 'SUPERADMIN'
  ) {
    return res.sendStatus(404).json({
      message:
        'Either no valid user or this user is not under your organization.',
    })
  }
  res.json({ user })
}

module.exports = { findAll, findOne }
