const bcrypt = require('bcrypt')

const encrypt = async (password: string) => {
  // hash the pass
  const salt = await bcrypt.genSalt(Number(String(process.env.SALT_NUMBER)))
  return await bcrypt.hash(password, salt)
}

export { encrypt }
