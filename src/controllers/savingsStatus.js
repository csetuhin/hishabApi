const sql = require('mssql')
const sqlCon = require('./sqlConnection')
const sqlQuerys = require('./querys')

const savingsStatus = async function(req, res) {
    var custNo, brCode, trnxDate
    try{
        let pool = await sql.connect(sqlCon)
        let result1 = await pool
        .request()
        .input('MobileNo',sql.Char(11),req.body.mobileNo)
        .query(sqlQuerys.custNoBrCode)
        
        custNo = result1.recordset[0].CustNo
        brCode = result1.recordset[0].BrCode
        
        sql.close()
    }
    catch{
        res.sttus(404).json({
            message: 'Content not fuound'
        })
    }

    try{

    }
    catch{
        res.sttus(404).json({
            message: 'Content not fuound'
        })
    }
    if (req.body.reportType == 'loanStatus') {
    sql.connect(sqlCon).then( pool =>{
        return pool
        .request()
       .input('CustNo', sql.Int,custNo)
       .input('BrCode', sql.Int,brCode)
        .query(sqlQuerys.savingsStatus)
    })
    .then(savingsStatus =>{
        res.status(200).json({
            savingsStatus: savingsStatus.recordset
        })
        sql.close
    }).catch(err =>{
        console.log(err.message)
        sql.close
    })
    }
    else {
        res.json({
            message: 'Invalid request'
        })
    }
}
module.exports = {
    savingsStatus
}