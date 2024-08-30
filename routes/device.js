const express = require('express')
const router = express.Router()
const {updateDeviceState} = require('../controllers/device')

router.put('/update-device-state/:id',updateDeviceState)
module.exports = router