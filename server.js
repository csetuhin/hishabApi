const sql = require('mssql')
const express = require('express')
const app = express()

app.use(express.json())

const sqlCon = require('./src/controllers/sqlConnection')
const hishabRoutes = require('./src/routes/hishabRoutes')
//const savingsController = require('./src/controllers/savingsStatus')
//const loanController = require('./src/controllers/loanStatus')

sql.on('error', err => {
    console.log(err.message)
})

//app.use('/api/savingsStatus', savingsController.savingsStatus)
//app.use('/udpn/loanStatus', loanController.loanStatus)
app.use('/',hishabRoutes)


const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`Server is running on PORT ${PORT}`)
})