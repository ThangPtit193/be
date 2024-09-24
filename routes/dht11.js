const express = require('express')
const router = express.Router()
const {getAllData,createData} = require('../controllers/dht11')

router.get('/get-data', getAllData);
router.post('/create', createData);

module.exports = router
