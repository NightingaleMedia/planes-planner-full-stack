require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

// TODO manage the seed script for produciton env
const prisma = new PrismaClient()

const bcrypt = require('bcrypt')

let vendors = [
  {
    vendorId: 6961,
    vendorName: 'PlanesVendor1',
  },
  {
    vendorId: 182,
    vendorName: 'PlanesVendor2',
  },
  { vendorId: 1844, vendorName: 'PlanesVendor3' },
]
async function main() {
  Promise.all(
    vendors.map(async (v) => {
      const salt = await bcrypt.genSalt(Number(String(process.env.SALT_NUMBER)))
      const pw = await bcrypt.hash('admin', salt)
      const email = `${v.vendorId}@${v.vendorName}.com`.toLowerCase()
      const data = {
        ...v,
        user: {
          email,
          password: pw,
          firstName: `${v.vendorId}`,
          lastName: `${v.vendorName}`,
        },
      }
      return data
    }),
  ).then(async (vendors) => {
    console.log(`Start seeding ...`)
    for (const v of vendors) {
      const vendor = await prisma.vendor
        .create({
          data: v,
        })
        .catch((err) => console.error(err))
      console.log('now making users: ', v.user)
      const users = await prisma.user
        .create({
          data: {
            email: v.user.email,
            vendorId: v.vendorId,
            password: v.user.password,
            firstName: v.user.firstName,
            lastName: v.user.lastName,
            roles: 4,
          },
        })
        .catch((err) => console.error(err))
      console.log(`Created vendor with id: ${vendor.id}`, users)
    }
    // await createAdmin()
    console.log(`Seeding finished.`)
  })
}

async function createAdmin() {
  const salt = await bcrypt.genSalt(Number(String(process.env.SALT_NUMBER)))
  const pw = await bcrypt.hash('password123', salt)
  console.log(pw)
  await prisma.vendor.create({
    data: {
      VendorId: 1111,
      VendorName: 'PLANES',
    },
  })

  await prisma.user.create({
    email: 'planesadmin@planescompanies.com',
    password: pw,
    firstName: `Planes`,
    lastName: `Admin`,
    Roles: 1,
  })
}

main()
  .catch((e) => {
    console.error('error: ' + e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
createAdmin()
  .then((res) => console.log('res: ', res))
  .finally(async () => {
    await prisma.$disconnect()
  })
  .catch((err) => console.log({ err }))
