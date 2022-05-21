const jwt = require('jsonwebtoken')

type JwtUser = {
  id: any
  vendorId: number
  firstName: string
  lastName: string
  email: string
  role: {
    id: number
    name: string
  }
  preferences: any
}

const createForgotPassJwt = (user: JwtUser) => {
  return jwt.sign({ ...user }, process.env.TOKEN_SECRET, {
    expiresIn: '10m',
  })
}

const createApiJwt = (user: JwtUser) => {
  return jwt.sign({ ...user }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  })
}

module.exports = {
  createApiJwt,
  createForgotPassJwt,
}
