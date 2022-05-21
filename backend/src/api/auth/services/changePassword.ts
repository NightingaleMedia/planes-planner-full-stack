import { PrismaClient } from '@prisma/client'
const { USER_RESPONSE } = require('src/utils/constants')
const prisma = new PrismaClient()

type ChangePassword = {
  userId: string
  newPassword: string
}

const changePassword = ({ userId, newPassword }: ChangePassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          password: newPassword,
        },
        select: USER_RESPONSE,
      })
      resolve(updated)
    } catch (err) {
      reject(err)
    }
  })
}
