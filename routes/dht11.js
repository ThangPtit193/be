const express = require('express')
const router = express.Router()
const { getAllData, createData, getDataByType } = require('../controllers/dht11')

router.get('/get-data', getAllData);
router.post('/create', createData);
router.get('/table-data', getDataByType)

module.exports = router
