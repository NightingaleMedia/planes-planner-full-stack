import express from 'express'
const authController = require('./controllers/auth.controllers')
const router = express.Router()

router.use('/verify', authController.verify)

router.post('/login', authController.login)

router.post('/forgot-password', authController.forgotPassword)

module.exports = router
