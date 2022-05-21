import express from 'express'
const meControllers = require('./controllers/me.controllers')
const router = express.Router()

router.get('/', meControllers.getMe)

router.post('/change-password', meControllers.changePass)

router.post('/confirm-password', meControllers.confirmPass)

module.exports = router
