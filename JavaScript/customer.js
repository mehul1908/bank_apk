var acStart;
var acList = JSON.parse(localStorage.getItem("acDetail"));

var logIn_account = JSON.parse(localStorage.getItem("logIn_account"));

if (
    typeof logIn_account != "undefined" ||
    logIn_account != null ||
    logIn_account.length != null ||
    logIn_account.length > 0
) {
    logIn_account = parseInt(logIn_account);
}

else {
    logIn_account = 0;
    let openedacJSON = JSON.stringify(logIn_account);
    localStorage.setItem("logIn_account", openedacJSON);
}

if (
    typeof acList != "undefined" &&
    acList != null &&
    acList.length != null &&
    acList.length > 0
) {
    acStart = acList[acList.length - 1].acno + 1;
}

else {
    acList = [];
    acStart = 10001;
}

var tranStart;
var tranList = JSON.parse(localStorage.getItem("tranDetail"));
if (
    typeof tranList != "undefined" &&
    tranList != null &&
    tranList.length != null &&
    tranList.length > 0
) {
    tranStart = tranList[tranList.length - 1].tranId + 1;

}

else {
    tranList = [];
    tranStart = 9000900;
}

class Transaction {
    tranId;
    remark;
    acno;
    type;
    amt;

    constructor(tranId, remark, acno, type, amt) {
        this.tranId = tranId;
        this.remark = remark;
        this.acno = acno;
        this.type = type;
        this.amt = amt;
    }
}

class Bank {
    acno;
    userName;
    address;
    phNo;
    scrQue;
    pin;
    bal;

    constructor(userName, address, phNo, scrQue, pin) {
        this.userName = userName;
        this.address = address;
        this.phNo = phNo;
        this.scrQue = scrQue;
        this.pin = pin;
        this.bal = 0;
        this.acno = acStart;
        alert("Account is added with account no. " + acStart);
        acStart++;
    }

    show_acno() {
        return this.acno;
    }

    add_amount(bal) {
        this.bal += bal;
    }
}
/**Create an Account */
function add_ac() {
    userName = document.getElementById("userName").value;
    address = document.getElementById("address").value;
    phNo = document.getElementById("phNo").value;
    scrQue = document.getElementById("scrQue").value;
    pin = document.getElementById("pin").value;
    cnfpin = document.getElementById("cnfpin").value;

    if (userName == "" || address == "" || phNo == "" || scrQue == "" || pin == "" || cnfpin == "") {
        alert("Fill all the Details!!");
        return;
    }

    if (pin != cnfpin) {
        alert("Your Pin and Confirm Pin is not Matching !!!!");
        return;
    }

    acList.push(new Bank(userName, address, phNo, scrQue, pin));
    let acListJSON = JSON.stringify(acList);
    localStorage.setItem("acDetail", acListJSON);
}

function init() {
    if ( logIn_account == 0) {
        alert("Please Log In First to use the Service.");
    }
    else {
        document.getElementById("acno").value = logIn_account;
    }
}
function LogIn() {
    let acno = document.getElementById("acno").value;
    let pin = document.getElementById("pin").value;
    if (acList != undefined)
        for (i of acList) {
            if (i.acno == acno) {
                if (i.pin == pin) {
                    logIn_account = i.acno;
                    alert("Account Logged In");
                    let openedacJSON = JSON.stringify(logIn_account);
                    localStorage.setItem("logIn_account", openedacJSON);
                    return;
                }

            }
        }
    alert("Account Number and Pin is not matched!!!");
}

function amt_Deposit() {
    let amt = +document.getElementById("amt").value;
    let rmk = document.getElementById("rmk").value;
    acList = JSON.parse(localStorage.getItem("acDetail"));
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    if (logIn_account == 0) {
        alert("Please login first<b>aa</b>");
        return;
    }
    else {
        acList[logIn_account - 10001].bal += amt;
        tranList.push(new Transaction(tranStart, rmk, logIn_account, '+', amt));
        let acListJSON = JSON.stringify(acList);
        localStorage.setItem("acDetail", acListJSON);
        let tranListJSON = JSON.stringify(tranList);
        localStorage.setItem("tranDetail", tranListJSON);
        alert("Amount is Deposited with Transaction Id:" + tranStart);
        tranStart++;
        return;
    }

}

/*--------------------------------------------------------------------------- */

function amt_withdraw() {
    let amt = +document.getElementById("amt").value;
    let rmk = document.getElementById("rmk").value;
    let pin = document.getElementById("pin").value;
    acList = JSON.parse(localStorage.getItem("acDetail"));
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    if (logIn_account == 0) {
        alert("Please login first<b>aa</b>");
        return;
    }
    // tranList = JSON.parse(localStorage.getItem("tranDetail"));
    else {
        if (acList[logIn_account - 10001].pin == pin) {
            if (acList[logIn_account - 10001].bal >= amt) {
                acList[logIn_account - 10001].bal -= amt;
                tranList.push(new Transaction(tranStart, rmk, logIn_account, '-', amt));
                let acListJSON = JSON.stringify(acList);
                localStorage.setItem("acDetail", acListJSON);
                let tranListJSON = JSON.stringify(tranList);
                localStorage.setItem("tranDetail", tranListJSON);
                alert("Amount is Withdraw with Transaction Id:" + tranStart);
                tranStart++;
            }
            else {
                alert("<h3>Your Account does not have sufficient Balance.<br>Please Check Your Account Balance");
            }
        }
        else {
            alert("Account Number and Pin does not Matches!!!");
        }
        return;
    }

}

function fund_tran() {

    let amt = +document.getElementById("amt").value;
    let rmk = document.getElementById("rmk").value;
    let pin = document.getElementById("pin").value;
    let bnfacno = document.getElementById("bnfacno").value;
    acList = JSON.parse(localStorage.getItem("acDetail"));
    // tranList = JSON.parse(localStorage.getItem("tranDetail"));
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    if (logIn_account == 0) {
        alert("Please login first<b>aa</b>");
        return;
    }
    else {
        if (acList[logIn_account - 10001].pin == pin) {
            if (acList[logIn_account - 10001].bal >= amt) {
                for (j of acList) {
                    if (j.acno == bnfacno) {
                        acList[logIn_account - 10001].bal -= amt;
                        j.bal += amt;
                        tranList.push(new Transaction(tranStart, rmk + " to " + bnfacno, acList[logIn_account - 10001], '-', amt));
                        tranList.push(new Transaction(tranStart, rmk + " from " + acList[logIn_account - 10001], bnfacno, '+', amt));
                        let acListJSON = JSON.stringify(acList);
                        localStorage.setItem("acDetail", acListJSON);
                        let tranListJSON = JSON.stringify(tranList);
                        localStorage.setItem("tranDetail", tranListJSON);
                        alert("Amount is Withdraw with Transaction Id:" + tranStart);
                        tranStart++;
                    }
                }
                alert("Beneficial Account Number is not existed.")
            }
            else {
                alert("<h3>Your Account does not have sufficient Balance.<br>Please Check Your Account Balance");
            }
        }
        else {
            alert("Account Number and Pin does not Matches!!!");
        }
        return;
    }

}

function show_detail() {
    let pin = document.getElementById("pin").value;
    acList = JSON.parse(localStorage.getItem("acDetail"));
    // tranList = JSON.parse(localStorage.getItem("tranDetail"));
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    if (logIn_account == 0) {
        alert("Please login first<b>aa</b>");
        return;
    }
    else {
        if (acList[logIn_account - 10001].pin == pin) {
            document.getElementById("userName").value = acList[logIn_account - 10001].userName;
            document.getElementById("address").value = acList[logIn_account - 10001].address;
            document.getElementById("phNo").value = acList[logIn_account - 10001].phNo;
            document.getElementById("bal").value = acList[logIn_account - 10001].bal;
        }
        else {
            alert("Account Number and Pin does not Matches!!!");
        }
        return;
    }
}

function upd_detail() {
    let upd_field = +document.getElementById("upd_field").value;
    let scrQue = document.getElementById("scrQue").value;
    let new_val = document.getElementById("new_val").value;
    let acList = JSON.parse(localStorage.getItem("acDetail"));
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    if (logIn_account == 0) {
        alert("Please login first<b>aa</b>");
        return;
    }
    else {
        if (acList[logIn_account - 10001].scrQue == scrQue) {
            switch (upd_field) {
                case 0:
                    acList[logIn_account - 10001].pin = new_val;
                    break;
                case 1:
                    acList[logIn_account - 10001].userName = new_val;
                    break;
                case 2:
                    acList[logIn_account - 10001].phNo = new_val;
                    break;
                case 3:
                    acList[logIn_account - 10001].address = new_val;
            }
            let acListJSON = JSON.stringify(acList);
            localStorage.setItem("acDetail", acListJSON);
            alert("Detail is Updated!!!")
        }
        else {
            alert("Security Answer does not matches with the Account Number!!!");
        }
        return;
    }
}

function chk_bal() {
    let acno = document.getElementById("acno").value;
    let pin = document.getElementById("pin").value;
    acList = JSON.parse(localStorage.getItem("acDetail"));
    // tranList = JSON.parse(localStorage.getItem("tranDetail"));
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    if (logIn_account == 0) {
        alert("Please login first<b>aa</b>");
        return;
    }
    else {
        if (acList[logIn_account - 10001].pin == pin) {
            document.getElementById("bal").value = i.bal;
        }
        else {
            alert("Account Number and Pin does not Matches!!!");
        }
        return
    }
}


function tran_hist() {
    k = 1;
    let acno = document.getElementById("acno").value;
    let pin = document.getElementById("pin").value;
    acList = JSON.parse(localStorage.getItem("acDetail"));
    tranList = JSON.parse(localStorage.getItem("tranDetail"));
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    if (logIn_account == 0) {
        alert("Please login first<b>aa</b>");
        return;
    }
    else if (acList[logIn_account - 10001].pin == pin) {
        for (j of tranList) {
            if (j.acno == acno) {
                addToTable(j);
            }
        }
    }

    function addToTable(obj1) {
        tr = document.createElement("tr");

        td1 = document.createElement("td");
        td1.innerText = k;
        k++;
        tr.appendChild(td1);

        td2 = document.createElement("td");
        td2.innerText = obj1.tranId;
        tr.appendChild(td2);

        td3 = document.createElement("td");
        td3.innerText = obj1.type;
        tr.appendChild(td3);

        td4 = document.createElement("td");
        td4.innerText = obj1.amt;
        tr.appendChild(td4);

        td5 = document.createElement("td");
        td5.innerText = obj1.remark;
        tr.appendChild(td5);

        document.getElementById("tableBody").appendChild(tr);
    }
}

function logOut() {
    let logIn_account = JSON.parse(localStorage.getItem("logIn_account"));
    logIn_account = 0;
    alert("Account is log Out!!!");
    let openedacJSON = JSON.stringify(logIn_account);
    localStorage.setItem("logIn_account", openedacJSON);
}