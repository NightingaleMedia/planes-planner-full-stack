import { PrismaClient } from '@prisma/client'
const { USER_RESPONSE } = require('../../../utils/constants')
const prisma = new PrismaClient()

const updatePass = async (id: number, hashedPassword: string) => {
  return await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
    select: USER_RESPONSE,
  })
}

module.exports = { updatePass }
