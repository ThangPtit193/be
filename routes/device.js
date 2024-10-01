const express = require('express')
const router = express.Router()
const { updateData, getData, getDataByCondition } = require('../controllers/device')

router.put('/update-device/:id', updateData)
router.get('/get-device', getData)
router.get('/table-data', getDataByCondition)

module.exports = router