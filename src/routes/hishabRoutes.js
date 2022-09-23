require('dotenv').config()
const express = require('express')
const router = express.Router()
const testController = require('../controllers/hishabStatusProcess')
const dataPassController = require('../controllers/streamPost')

router.get('/mfi/udpn', testController.hishabStatus)
router.get('/mfi/udpn/passData', dataPassController.dataPass)
router.get('/mfi/udpn/auditData', dataPassController.auditDataPass)

module.exports = router