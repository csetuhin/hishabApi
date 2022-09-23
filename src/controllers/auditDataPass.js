const sql = require('mssql')
const sqlCon = require('./sqlConnection')
const sqlQuerys = require('./querys')


const AuditDataPass = async function(req, res) {
    let custNo, brCode, rsDate, mobileNo, tempResult, customers = []

    try{
        // //++++++++++++++ Start Try

        let pool = await sql.connect(sqlCon)

        let phoneNo = await pool
        .request()
        .query(sqlQuerys.testDataStream)

        for (i = 0; i < phoneNo.recordset.length; i++) {
        
        mobileNo = phoneNo.recordset[i].MobileNo

        const result1 = await pool
        .request()
        .input('MobileNo',sql.Char(11),mobileNo)
        .query(sqlQuerys.custNoBrCode)

        custNo = result1.recordset[0].CustNo
        brCode = result1.recordset[0].BrCode

        rsDate = await pool.request().input('CustNo', sql.Int,custNo)
        .input('BrCode', sql.Int,brCode).query(sqlQuerys.transactionDate)
        rsDate = rsDate.recordset[0].rsDate

        console.log('SrNo: '+ i + ' ' + mobileNo + ' ' + rsDate)

        const trnxLnData = await pool.request()
        .input('CustNo', sql.Int,custNo)
        .input('BrCode', sql.Int,brCode)
        .input('LastTrnXDate',sql.Date,rsDate)
        .query(sqlQuerys.lastLoanTransaction)

        const trnxSbData = await pool.request()
        .input('CustNo', sql.Int,custNo)
        .input('BrCode', sql.Int,brCode)
        .input('LastTrnXDate',sql.Date,rsDate)
        .query(sqlQuerys.lastSavingsTransaction)

        //sql.close()

        let totalSavings = 0, totalLoan = 0, totalTransaction = 0

        for (j = 0; j < trnxSbData.recordset.length; j++){
            totalSavings += trnxSbData.recordset[j].installment
        }

        for (j = 0; j < trnxLnData.recordset.length; j++){
            totalLoan += (trnxLnData.recordset[j].loanInstallment + trnxLnData.recordset[j].serviceCharge)
        }
        totalTransaction = totalLoan + totalSavings

        lnStatus = trnxLnData.recordset
        sbStatus = trnxSbData.recordset

        if(lnStatus.length > 0 && sbStatus.length > 0){
        transactionInfo = {
            transactionId: 'UDPN_TrnX_Id',
            transactionDate: rsDate,
            lonsStatus: lnStatus,
            totalLoan: totalLoan,
            savingsStatus: sbStatus,
            totalSavings,
            totalTransaction
        }
    }
    else if(lnStatus.length > 0 && sbStatus.length <= 0){
        transactionInfo = {
            transactionId: 'UDPN_TrnX_Id',
            transactionDate: rsDate,
            lonsStatus: lnStatus,
            totalLoan: totalLoan,
            totalTransaction
        }
    }
    else if(sbStatus.length > 0 && lnStatus.length <= 0){
        transactionInfo = {
            transactionId: 'UDPN_TrnX_Id',
            transactionDate: rsDate,
            savingsStatus: sbStatus,
            totalSavings,
            totalTransaction
        }
    }

            tempResult = {
                customerId: custNo,
                customerType: 'BO',
                phoneNumber: mobileNo,
                transactionInfo
            }
            customers.push(tempResult)
        //++++++++++++++ End Try
        }
        
    }

    catch{
        res.status(404).json({
            message: 'Content not found....'
        })
    }
    res.status(200).json({
        timeStamp: new Date().toISOString(),
        orgId: 3,
        organizationName: 'UDDIPAN',
        organizationType: 'MFI',
        customers
    })
   
}

module.exports = {
    AuditDataPass
}