import { PrismaClient } from '@prisma/client'
import { UserRequest } from '../../../types'

const prisma = new PrismaClient()

const createVendor = async (req: UserRequest) => {
  // this already is only super admin
  let requiredFields = ['vendorName', 'vendorCode']
  let { vendorName, vendorCode } = req.body
  let missingFields = requiredFields.reduce((arr, item) => {
    if (!req.body[item]) {
      arr.push(item)
    }
    return arr
  }, [])

  if (missingFields.length > 0) {
    throw {
      status: 406,
      message: `Some fields are missing.`,
    }
  }

  // check that vendorId is valid vendor
  const vendor = await prisma.vendor.findMany({
    where: {
      OR: [
        {
          VendorName: String(vendorName),
        },
        {
          VendorCode: String(vendorCode),
        },
      ],
    },
  })

  if (vendor && vendor.length > 0) {
    throw {
      status: 400,
      message: `That Vendor Name or Code already exists! Vendor: ${vendor[0].VendorName}, Code: ${vendor[0].VendorCode}`,
    }
  }
  try {
    const newVendor = await prisma.vendor.create({
      data: {
        VendorName: vendorName,
        VendorLongName: req.body.vendorLongName || '',
        VendorCode: String(vendorCode) || null,
      },
      select: {
        VendorId: true,
        VendorName: true,
        VendorCode: true,
        VendorLongName: true,
      },
    })
    return newVendor
  } catch (error) {
    console.log('create vendor error: ', error.toString())
    throw { message: error, status: 400 }
  }
}

module.exports = { createVendor }
