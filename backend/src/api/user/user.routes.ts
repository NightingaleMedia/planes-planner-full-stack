import express from 'express'
const router = express.Router()
const userController = require('./controllers/user.controllers')

router.get('/', userController.findAll)

router.get('/:id', userController.findOne)

module.exports = router
