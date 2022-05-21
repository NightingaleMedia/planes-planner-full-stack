import express from 'express'
import { UserRequest } from '../../types'
const { purchaseOrderNotify } = require('../../services/email')
const adminUser = require('./controllers/users/admin.users.controllers')
const { onlyAdmin, onlySuperAdmin } = require('../../middleware/auth')
const { userEditMiddleware } = require('../../middleware/admin')
const router = express.Router()

router.get('/', onlyAdmin, (req, res, next) => {
  res.send('choose /vendor or /user')
})

router.all('/vendors/:id', onlyAdmin, (req: UserRequest, res, next) => {
  const { user, params } = req
  // if your're a super admin go head;
  if (user.Roles.RoleName !== 'SUPERADMIN') {
    if (params.id !== user.vendorId) {
      return res.status(401).send({
        message: 'Unauthorized, you cannot change other vendor information',
      })
    }
  }
  return res.json({ user, params })
})

router.post('/users', onlyAdmin, adminUser.create)

router.post('/purchase-order-notify', (req, res) => {
  let { emails, purchaseOrderId } = req.body

  emails = JSON.parse(emails)
  purchaseOrderNotify(emails, purchaseOrderId)
  return res.send(emails)
})

router.all(
  '/users/:id',
  onlyAdmin,
  // see if they can edit the user they requested
  // checks for either super admin or vendor id match
  // this adds a req.userToChange
  userEditMiddleware,
  async (req, res, next) => {
    switch (req.method) {
      case 'GET':
        return await adminUser.findOne(req, res, next)
      case 'PUT':
        return await adminUser.change(req, res, next)
      case 'DELETE':
        return await adminUser.deleteOne(req, res, next)
      default:
        return res.status(404).send({ message: 'Not found' })
    }
  },
)

module.exports = router
