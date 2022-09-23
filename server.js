const sql = require('mssql')
const express = require('express')
const app = express()

const hishabRoutes = require('./src/routes/hishabRoutes')

app.use(express.json())

sql.on('error', err => {
    console.log(err.message)
})

app.use('/',hishabRoutes)


const PORT = process.env.PORT || 80

app.listen(PORT, () =>{
    console.log(`Server is running on PORT ${PORT}`)
})

//pkg server.js -t node18-win