require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const fs = require('fs')
// async function main() {
//   Promise.all(
//     vendors.map(async (v) => {
//       const salt = await bcrypt.genSalt(Number(String(process.env.SALT_NUMBER)))
//       const pw = await bcrypt.hash('admin', salt)
//       const email = `${v.vendorId}@${v.vendorName}.com`.toLowerCase()
//       const data = {
//         ...v,
//         user: {
//           email,
//           password: pw,
//           firstName: `${v.vendorId}`,
//           lastName: `${v.vendorName}`,
//         },
//       }
//       return data
//     }),
//   ).then(async (vendors) => {
//     console.log(`Start seeding ...`)
//     for (const v of vendors) {
//       const vendor = await prisma.vendor
//         .create({
//           data: v,
//         })
//         .catch((err) => console.error(err))
//       console.log('now making users: ', v.user)
//       const users = await prisma.user
//         .create({
//           data: {
//             email: v.user.email,
//             vendorId: v.vendorId,
//             password: v.user.password,
//             firstName: v.user.firstName,
//             lastName: v.user.lastName,
//             roles: 4,
//           },
//         })
//         .catch((err) => console.error(err))
//       console.log(`Created vendor with id: ${vendor.id}`, users)
//     }
//     // await createAdmin()
//     console.log(`Seeding finished.`)
//   })
// }

async function createAdmin() {
  const salt = await bcrypt.genSalt(Number(String(process.env.SALT_NUMBER)))
  const pw = await bcrypt.hash('admin', salt)

  const user = await prisma.user
    .findMany({
      where: {
        email: {
          equals: process.env.PLANES_SUPER_ADMIN_EMAIL,
        },
      },
    })
    .then((res) => res[0])

  if (user) {
    throw `User already exists, see super-admin.json`
  }
  const newUser = await prisma.user.create({
    data: {
      email: process.env.PLANES_SUPER_ADMIN_EMAIL,
      password: pw,
      firstName: `Planes`,
      lastName: `Admin`,
      Roles: {
        connect: {
          RoleId: 1,
        },
      },
      vendorId: Number(process.env.PLANES_VENDOR_ID),
    },
  })
  const deleteTokens = [
    'forgotPasswordToken',
    'password',
    'verifyPasswordToken',
    'preferences',
    'CreateDt',
    'CreateUser',
    'UpdateDt',
    'UpdateUser',
  ]

  deleteTokens.forEach((entry) => delete newUser[entry])

  newUser.password = 'admin'
  fs.writeFile('super-admin.json', JSON.stringify({ user: newUser }), (err) => {
    if (err) throw err
  })
}

// main()
//   .catch((e) => {
//     console.error('error: ' + e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
createAdmin()
  .then((res) => console.log('res: ', res))
  .finally(async () => {
    await prisma.$disconnect()
  })
  .catch((err) => console.log({ err }))
