const sql = require('mssql')
const sqlCon = require('./sqlConnection')

// Async Await
var brCode, rs
async function getData() {
rs = 0
    try {
        let pool = await sql.connect(sqlCon)
        let result1 = await pool.request().query('Select * From D045057C')
        sql.close()

        for (i = 0; i < result1.recordset.length; i++){
            rs = rs + result1.recordset[i].Period
        }
        console.log(rs)
        //return rs
    }
 catch (error){
    console.log(error.message)
    sql.close()
 }
}

const processData = getData()
module.exports = {
    processData
}