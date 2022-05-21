import { PrismaClient } from '@prisma/client'
import { encrypt } from '../../../user/services/encrypt'
import { UserRequest } from '../../../../types'
const { getRoleFromName } = require('../../../user/services/getRoleFromName')
const prisma = new PrismaClient()
const createUser = require('../../../user/services/create')
const { deleteUser } = require('../../../user/services/deleteUser')

const create = async (req: UserRequest, res: any, next: any) => {
  const { body } = req
  console.log(`create request`, req.user.email)
  if (!body.vendorId) {
    return res.status(400).send({ message: 'vendorId required.' })
  }

  if (req.user.Roles.RoleName === 'SUPERADMIN') {
    return await createUser(req, res, next)
  } else if (req.user.vendorId !== body.vendorId) {
    return res
      .status(401)
      .send({ message: 'You can only create users for your vendor id' })
  }
  return await createUser(req, res, next)
}

const findOne = async (req: any, res: any, next: any) => {
  return res.send(req.userToChange)
}

const change = async (req: any, res: any, next: any) => {
  let { body } = req
  delete body.id
  if (
    req.user.role.name != 'SUPERADMIN' &&
    req.userToChange.role.name === 'SUPERADMIN'
  ) {
    return res.status(401).json({ message: "You can't make super admins!" })
  }

  if (body.role) {
    try {
      const roleId = await getRoleFromName(body.role)

      console.log({ roleId })
      if (!roleId) {
        throw 'No Role ID'
      }
      body.Roles = {
        connect: {
          RoleId: Number(roleId),
        },
      }

      delete body.role
    } catch (error) {
      return res.status(400).send({ message: error })
    }
  }

  if (req.body.password) {
    const newPass = req.body.password
    const encryptedPass = await encrypt(newPass)
    body.password = encryptedPass
  }
  try {
    const updated = await prisma.user.update({
      where: {
        id: req.userToChange.id,
      },
      data: body,
    })
    return res.status(200).send({ message: `Updated user ${updated.id}` })
  } catch (error) {
    return res.status(400).send({ message: error.toString() })
  }
}

const deleteOne = async (req: any, res: any, next: any) => {
  if (
    req.user.vendorId !== req.userToChange.vendorId &&
    req.user.role !== 'SUPERADMIN'
  ) {
    return res
      .status(401)
      .send({ message: 'You can only delete users for your vendor id' })
  }

  try {
    console.log('deleting user')
    let result = await deleteUser(req.userToChange.id)
    return res.status(200).json({ message: result })
  } catch (error) {
    return res.status(400).json({ message: error })
  }
}

module.exports = {
  findOne,
  create,
  change,
  deleteOne,
}
