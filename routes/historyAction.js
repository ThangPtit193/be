const express = require('express')
const router = express.Router()
const { saveHistory, getDeviceHistoryByTime } = require('../controllers/historyAction')

router.post('/history-action', saveHistory);
router.get('/get-device/table_device', getDeviceHistoryByTime)

module.exports = router
