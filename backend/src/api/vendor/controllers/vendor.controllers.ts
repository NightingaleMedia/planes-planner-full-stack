import { PrismaClient, Vendor } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { UserRequest } from '../../../types'
const { createVendor } = require('../services/create')
const prisma = new PrismaClient()

const create = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const vendor: Vendor = await createVendor(req)
    res
      .status(201)
      .send({ message: `Created vendor ${vendor.VendorLongName}`, vendor })
  } catch (error) {
    console.log(error)
    return res.status(400).send(error)
  }
}

const findAll = async (req: UserRequest, res: Response, next: NextFunction) => {
  let vendors: any

  switch (req.user.Roles.RoleName) {
    // if its vendor admin just do that vendor
    case 'VENDORADMIN':
      vendors = await prisma.vendor.findMany({
        where: {
          VendorId: {
            equals: req.user.vendorId,
          },
        },
      })

      vendors[0].numUsers = vendors[0].users.length

      break
    // if its super admin, find all
    case 'SUPERADMIN':
      vendors = await prisma.vendor.findMany({
        select: {
          VendorName: true,
          VendorCode: true,
          VendorLongName: true,
          VendorId: true,
        },
      })

      vendors.forEach((v: any) => (v.id = v.VendorId))

      break
    default:
      return res.status(404).json({ message: 'No users found' })
  }

  return res.json({ vendors })
}

const findOne = async (req: UserRequest, res: Response, next: NextFunction) => {
  const id = req.params.id
  if (!id) {
    res.status(404).send({ message: 'ID not provided' })
  }
  const vendorToRetrieve = await prisma.vendor.findUnique({
    where: {
      VendorId: Number(id),
    },
  })

  if (req.user.Roles.RoleName === 'SUPERADMIN') {
    return res.json(vendorToRetrieve)
  } else if (req.user.vendorId === vendorToRetrieve.VendorId) {
    return res.json(vendorToRetrieve)
  } else {
    return res.status(400).send({ message: 'Unauthorized' })
  }
}

const updateOne = async (req: UserRequest, res: Response) => {
  const vendorToUpdate = await prisma.vendor.findUnique({
    where: {
      VendorId: req.params.id,
    },
  })

  if (!vendorToUpdate) {
    return res.status(404).send({ message: 'Could not find that vendor.' })
  }

  try {
    console.log(req.body)
    const updated = await prisma.vendor.update({
      where: {
        VendorId: vendorToUpdate.VendorId,
      },
      data: { ...req.body },
    })

    return res.send({ message: `Updated ${updated.VendorLongName}!` })
  } catch (error) {
    res.status(400).send({ message: error.toString() })
  }
}

const deleteOne = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id
  if (!id) {
    return res.status(404).send({ message: 'ID not provided' })
  }

  try {
    const vendorToDelete = await prisma.vendor.delete({
      where: {
        VendorId: Number(id),
      },
    })

    return res.send({
      message: `Deleted! ${vendorToDelete.VendorName}, please allow a moment for the changes to populate.`,
    })
  } catch (error) {
    res.status(400).send({ message: error.toString() })
  }
}

module.exports = { create, findAll, findOne, updateOne, deleteOne }
