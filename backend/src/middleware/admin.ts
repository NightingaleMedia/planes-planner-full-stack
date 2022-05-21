import { User } from '.prisma/client'
import { NextFunction, Request, Response } from 'express'
import { ApiUser, UserRequest } from '../types'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export interface UserEditRequest extends UserRequest {
  userToChange: ApiUser | null
}

const userEditMiddleware = async (
  req: UserEditRequest,
  res: Response,
  next: NextFunction,
) => {
  const { user, params } = req
  let retrievedUser
  try {
    retrievedUser = await prisma.user.findUnique({
      where: {
        id: Number(params.id),
      },
    })
  } catch (error) {
    console.log('error in admin middleware', error)
    return res.status(400).send({ message: error })
  }

  if (user.Roles.RoleName !== 'SUPERADMIN') {
    // check if the user is trying to edit belongs to that vendor
    if (retrievedUser.vendorId !== user.vendorId) {
      return res.status(401).send({
        message: 'Unauthorized, you cannot change other vendor information',
      })
    }
  }
  if (!retrievedUser) {
    return res.status(404).send({ message: 'No user found for that id' })
  }

  req.userToChange = retrievedUser

  next()
}

module.exports = { userEditMiddleware }
