const express = require('express')
const router = express.Router()
const { updateData, getData, getDeviceByTime } = require('../controllers/device')

router.put('/update-device/:id', updateData)
router.get('/get-device', getData)
router.get('/get-device/table_device', getDeviceByTime)

module.exports = router