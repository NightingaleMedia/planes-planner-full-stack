import express from 'express'
const authRoutes = require('../api/auth/auth.routes')
const userRoutes = require('../api/user/user.routes')
const meRoutes = require('../api/me/me.routes')
const adminRoutes = require('../api/admin/admin.routes')
const errorRoutes = require('../api/error/error.routes')
const vendorRoutes = require('../api/vendor/vendor.routes')
const router = express.Router()
const { jwt, onlyAdmin, onlySuperAdmin } = require('../middleware/auth')

const allRoutes = [
  {
    path: '/auth',
    middleware: [],
    route: authRoutes,
  },
  {
    path: '/email-webmaster/error',
    middleware: [],
    route: errorRoutes,
  },
  {
    path: '/user',
    middleware: [onlyAdmin],
    route: userRoutes,
  },
  {
    path: '/me',
    middleware: [jwt],
    route: meRoutes,
  },
  {
    path: '/admin',
    middleware: [],
    route: adminRoutes,
  },
  {
    path: '/vendor',
    middleware: [onlyAdmin],
    route: vendorRoutes,
  },
]

allRoutes.forEach((route) => {
  console.log({ path: route.path })
  router.use(route.path, route.middleware, route.route)
})

module.exports = {
  routes: router,
}
