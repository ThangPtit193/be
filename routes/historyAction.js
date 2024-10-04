const express = require('express')
const router = express.Router()
const { saveHistory } = require('../controllers/historyAction')
const { getDataByCondition } = require('../controllers/device')

router.post('/history-action', saveHistory)
module.exports = router