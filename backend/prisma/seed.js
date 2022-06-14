require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const fs = require('fs')

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

createAdmin()
  .then((res) => console.log('res: ', res))
  .finally(async () => {
    await prisma.$disconnect()
  })
  .catch((err) => console.log({ err }))
