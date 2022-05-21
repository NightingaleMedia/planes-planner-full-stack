import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const deleteUser = async (id: any) => {
  const userToDelete = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!userToDelete) {
    throw 'Cannot find a user with that ID'
  }
  const deleted = await prisma.user.delete({ where: { id: Number(id) } })
  return `Deleted ${userToDelete.firstName} ${userToDelete.lastName}.`
}

module.exports = { deleteUser }
