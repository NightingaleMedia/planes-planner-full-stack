import { PrismaClient } from '@prisma/client'
const bcrypt = require('bcrypt')

// only that person can change their password
// if you want an admin to do it, then use the 'user' route
const createPass = async (newPassword: string) => {
  const salt = await bcrypt.genSalt(Number(String(process.env.SALT_NUMBER)))
  newPassword = await bcrypt.hash(newPassword, salt)

  return newPassword
}

module.exports = {
  createPass,
}
