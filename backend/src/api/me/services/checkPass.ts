import { PrismaClient } from '@prisma/client'
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

type CheckPass = {
  email: string
  password: string
}

const checkPass = ({ email, password }: CheckPass) => {
  return new Promise(async (resolve, reject) => {
    email = email.toLowerCase()
    console.log('chech password:', email)
    const users = await prisma.user.findMany({
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.length === 0) {
      return reject('No User Found...')
    }

    const userToCheck = users[0]
    const verified = await bcrypt.compare(password, userToCheck.password)

    if (verified) {
      resolve(userToCheck)
    } else {
      reject('Could not verify password')
    }
  })
}

module.exports = { checkPass }
