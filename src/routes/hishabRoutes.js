const express = require('express')
const router = express.Router()
const app = express()
const loanStatusController = require('../controllers/hishabStatus')
const testController = require('../controllers/hishabStatusProcess')
app.use(express.json())


router.get('/udpn',  loanStatusController.hishabStatus)
router.get('/test', testController.hishabStatus)

module.exports = router