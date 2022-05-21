import { User, Roles } from '.prisma/client'
import { Request } from 'express'

export type ApiUser = {
  id: any
  vendorId: number
  firstName: string
  lastName: string
  email: string
  role: number
  Roles: {
    RoleId: number
    RoleName: string
    preferences: any
  }
}
export interface UserRequest extends Request {
  user: ApiUser
  params: any
}
