import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const getRoleFromName = async (roleName: string) => {
  return await prisma.roles
    .findMany({
      where: {
        RoleName: roleName,
      },
    })
    .then((res) => res[0].RoleId)
}

module.exports = { getRoleFromName }
