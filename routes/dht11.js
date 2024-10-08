const express = require('express')
const router = express.Router()
const { getAllData, createData, getDataWithCondition } = require('../controllers/dht11')

router.get('/get-data', getAllData);
router.post('/create', createData);
router.get('/table-data', getDataWithCondition)

module.exports = router
