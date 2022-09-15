const sqlQuerys = {

    custNoBrCode: 
    `
        Select Top 1 CustNo, BrCode From v_Client a Where (a.MobileNo_1 = @MobileNo Or a.MobileNo_2 = @MobileNo) AND a.CustStatus<>2
    `,

    transactionDate:
    `
        Select Max(EntryDate)rsDate
        From D009040 Where LBrCode = @BrCode And SubString(MainAcctId,9,8) = @CustNo And MainModType In (11,20,30) 
        And CanceledFlag <> 'C' And DrCr = 'C' And (BookType = 'XX' or BatchCd In ('DFS','TR'))
    `,
    loanStatus: 
    `        
        Select
        Convert(Date, a.DateOpen) disburseDate,
        RTrim(d.[BanglaName]) product, e.AppldLoanAmt principal, 
        Round((b.DisbursedAmtFcy + b.MainBalFcy + b.PenalPaidFcy + b.TotalCredit)/e.InstAmt,2)installmentPaid,
        b.DisbursedAmtFcy + b.MainBalFcy + b.PenalPaidFcy + b.TotalCredit totalPaid, 
        e.Period - Round((b.DisbursedAmtFcy + b.MainBalFcy + b.PenalPaidFcy + b.TotalCredit)/e.InstAmt,2) installmentDue,
        -b.MainBalFcy + (Select Sum(IntAmt) From D009244 Where LBrCode = a.LBrCode and PrdAcctId = a.PrdAcctId)totalDue
        From D009022 a
        Inner Join D030003 b on a.LBrCode = b.LBrCode and a.PrdAcctId = b.PrdAcctId
        Inner Join D045057 e on a.PrdAcctId = e.LoanAccNum
        Inner Join Bangla_Product d on SubString(a.PrdAcctId,1,8) = d.PrdCode
        Where a.LBrCode = @BrCode And a.CustNo = @CustNo
        And a.AcctStat In (1,2)
    `,
    savingsStatus:
    `
		Select
		RTrim(e.BanglaName) product, Sum(a.ShdClrBalFcy)balance
		From D009022 a
		Inner Join D009021 d on SubString(a.PrdAcctId,1,8) = d.PrdCd And d.LBrCode = 100066
		Inner Join Bangla_Product e on e.PrdCode=d.PrdCd
		Where a.LBrCode = @BrCode And a.CustNo = @CustNo 
		And d.ModuleType <> 30 and a.ShdClrBalFcy <> 0
		And a.AcctStat <> 3 And a.AcctStat <> 14
		Group by e.BanglaName
    `,
    lastLoanTransaction:
    `
        Select
        RTrim(f.BanglaName) product,
        Sum(Case When (a.VcrAcctId Like '23%' Or a.VcrAcctId Like '94%') And a.MainAcctId LIke '23%' And a.DrCr = 'C' Then FcyTrnAmt
        When (a.VcrAcctId Like '23%' Or a.VcrAcctId Like '94%') And a.MainAcctId LIke '23%' And a.DrCr = 'C' Then FcyTrnAmt Else 0 End)loanInstallment,
        Sum(Case When a.DrCr = 'C' Then FcyTrnAmt Else -FcyTrnAmt End) -
        Sum(Case When (a.VcrAcctId Like '23%' Or a.VcrAcctId Like '94%') And a.MainAcctId LIke '23%' And a.DrCr = 'C' Then FcyTrnAmt
        When (a.VcrAcctId Like '23%' Or a.VcrAcctId Like '94%') And a.MainAcctId LIke '23%' And a.DrCr = 'C' Then FcyTrnAmt Else 0 End)
        serviceCharge
        From D009022 b
        Inner Join D009040 a on a.LBrCode = b.LBrCode And SubString(a.MainAcctId,1,24) = SubString(b.PrdAcctId,1,24)
        Inner Join D009021 c on SubString(b.PrdAcctId,1,8) = c.PrdCd And c.LBrCode = 100066
        Inner Join Bangla_Product f on f.PrdCode=c.PrdCd
        Where b.LBrCode = @BrCode And b.CustNo = @CustNo And a.EntryDate = @LastTrnXDate
        and a.CanceledFlag <> 'C' and (a.BatchCd In ('DFS','TR') Or a.BookType = 'XX')
        And c.ModuleType = 30
        group by f.BanglaName
    `,
    lastSavingsTransaction:
    `
        Select
        RTrim(f.BanglaName) product,
        Sum(Case When a.DrCr = 'C' Then FcyTrnAmt Else -FcyTrnAmt End)installment
        From D009022 b
        Inner Join D009040 a on a.LBrCode = b.LBrCode And SubString(a.MainAcctId,1,24) = SubString(b.PrdAcctId,1,24)
        Inner Join D009021 c on SubString(b.PrdAcctId,1,8) = c.PrdCd And c.LBrCode = 100066
        Inner Join Bangla_Product f on f.PrdCode=c.PrdCd
        Where b.LBrCode = @BrCode And b.CustNo = @CustNo And a.EntryDate = @LastTrnXDate
        And c.ModuleType In (11,20)
        Group by f.BanglaName
    `,
    PrdAcctId:
    `
        Select
        IsNull(b.PrdAcctId, a.PrdAcctId)PrdAcctId
        From D009022 a
        Left Join D020004 b on a.LBrCode = b.LBrCode And SubString(a.PrdAcctId,1,24) = SubString(b.PrdAcctId,1,24) and b.MainBalFcy <> 0
        Where a.LBrCode = @BrCode And a.CustNo = @CustNo
        And a.AcctStat In (1,2)
    `
}

module.exports = sqlQuerys