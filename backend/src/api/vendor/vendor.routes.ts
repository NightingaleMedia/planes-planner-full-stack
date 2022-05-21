import * as express from 'express'
const router = express.Router()
const vendorController = require('./controllers/vendor.controllers')
const { onlySuperAdmin } = require('../../middleware/auth')

router.post('/', onlySuperAdmin, vendorController.create)
router.get('/', vendorController.findAll)
router.get('/:id', vendorController.findOne)
router.put('/:id', onlySuperAdmin, vendorController.updateOne)
router.delete('/:id', onlySuperAdmin, vendorController.deleteOne)

module.exports = router
