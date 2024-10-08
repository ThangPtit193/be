const express = require('express')
const router = express.Router()
const { updateData, getData } = require('../controllers/device')

router.put('/update-device/:id', updateData)
router.get('/get-device', getData)

module.exports = router