const sql = require('mssql')
const sqlCon = require('./sqlConnection')
const sqlQuerys = require('./querys')
const { savingsStatus } = require('./querys')

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

    // Execution Part
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
    else if (req.body.reportType == 'lastTransaction'){
    let sbStatus, lnStatus
    try{
        let pool = await sql.connect(sqlCon)
        let rsDate = await pool.request().input('CustNo', sql.Int,custNo)
        .input('BrCode', sql.Int,brCode).query(sqlQuerys.transactionDate)
        rsDate = rsDate.recordset[0].rsDate

        let trnxLnData = await pool.request()
        .input('CustNo', sql.Int,custNo)
        .input('BrCode', sql.Int,brCode)
        .input('LastTrnXDate',sql.Date,rsDate)
        .query(sqlQuerys.lastLoanTransaction)

        let trnxSbData = await pool.request()
        .input('CustNo', sql.Int,custNo)
        .input('BrCode', sql.Int,brCode)
        .input('LastTrnXDate',sql.Date,rsDate)
        .query(sqlQuerys.lastSavingsTransaction)

        sql.close()

        let totalSavings = 0, totalLoan = 0, totalTransaction = 0

        for (i = 0; i < trnxSbData.recordset.length; i++){
            totalSavings += trnxSbData.recordset[i].installment
        }

        for (i = 0; i < trnxLnData.recordset.length; i++){
            totalLoan += (trnxLnData.recordset[i].loanInstallment + trnxLnData.recordset[i].serviceCharge)
        }
        totalTransaction = totalLoan + totalSavings

        lnStatus = trnxLnData.recordset
        sbStatus = trnxSbData.recordset

        if(lnStatus.length > 0 && sbStatus.length > 0){
        res.status(200).json({
            transactonDate:rsDate,
            lonsStatus: lnStatus,
            totalLoan: totalLoan,
            savingsStatus: sbStatus,
            totalSavings,
            totalTransaction
        })
    }
    else if(lnStatus.length > 0 && sbStatus.length <= 0){
        res.status(200).json({
            transactonDate:rsDate,
            lonsStatus: lnStatus,
            totalLoan: totalLoan,
            totalTransaction
        })
    }
    if(sbStatus.length > 0 && lnStatus.length <= 0){
        res.status(200).json({
            transactonDate:rsDate,
            savingsStatus: sbStatus,
            totalSavings,
            totalTransaction
        })
    }
    }
    catch{
        
        res.status(404).json({
            message: 'Content not found...'
        })
        sql.close()
    }

    }
    else {
    res.status(403).json({
        message: 'Invalid request'
    })
}

}

module.exports = {
    hishabStatus
}