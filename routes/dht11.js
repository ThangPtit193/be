const express = require('express')
const router = express.Router()
const {getAllData} = require('../controllers/dht11')

router.get('/get-data', getAllData)
module.exports = router
