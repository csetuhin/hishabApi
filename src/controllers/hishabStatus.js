const sql = require('mssql')
const sqlCon = require('./sqlConnection')
const sqlQuerys = require('./querys')

const hishabStatus = async function(req, res) {
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
        res.status(404).json({
            message: 'Content not found'
        })
    }

    try{

    }
    catch{
        res.sttus(404).json({
            message: 'Content not found'
        })
    }
    if (req.body.reportType == 'loanStatus') {
    sql.connect(sqlCon).then( pool =>{
        return pool
        .request()
       .input('CustNo', sql.Int,custNo)
       .input('BrCode', sql.Int,brCode)
        .query(sqlQuerys.loanStatus)
    })
    .then(loanStatus =>{
        res.status(200).json({
            loanStatus: loanStatus.recordset
        })
        sql.close
    }).catch(err =>{
        console.log(err.message)
        sql.close
    })
}
else if (req.body.reportType == 'savingsStatus') {
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
    res.status(504).send({error:"Not found..."});
}

}

module.exports = {
    hishabStatus
}