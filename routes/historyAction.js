const express = require('express')
const router = express.Router()
const {saveHistory} = require('../controllers/historyAction')

router.post('/history-action',saveHistory)

module.exports = router