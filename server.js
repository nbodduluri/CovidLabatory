const app = require("express")();
const express = require("express");
var mysql = require("mysql");
const cors = require('cors');
const bodyparser = require('body-parser');

// body parser middleware
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));
// static folder
app.use(express.static(__dirname + "/public"));

const SELECT_ALL_EMPLOYEES = 'SELECT * FROM covidtest.Employee;';
const SELECT_ALL_LABTECH = 'SELECT * FROM covidtest.LabEmployee;'
const SELECT_ALL_EMPLOYEETEST = 'SELECT * FROM covidtest.EmployeeTest;';

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "covidtest",
    port: "3306",
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get("/", (req, res) => {
    res.send(require("./home/home.js").text);
});
app.get('/employees', (req,res) => {
    connection.query(SELECT_ALL_EMPLOYEES, (err,results) => {
        if(err){
           return res.send(err) 
        }
        else{
            res.json({
                data: results
            })
        }
    });
});
app.get('/labEmployeeData', (req,res) => {
    connection.query(SELECT_ALL_LABTECH, (err,results) => {
        if(err){
           return res.send(err) 
        }
        else{
            res.json({
                data: results
            })
        }
    });
});
app.get('/EmployeeTestData', (req,res) => {
    connection.query(SELECT_ALL_EMPLOYEETEST, (err,results) => {
        if(err){
           return res.send(err) 
        }
        else{
            res.json({
                data: results
            })
        }
    });
});
app.get("/employee", (req, res) => {
    let text = require("./employee/employeeLogin.js");
    res.send(text);
});
app.post("/employee", (req, res) => {
    console.log(req.body);
    connection.query(
        `select E.employeeID, E.firstName, E.lastName 
    from Employee E
    where E.email = '${req.body.email}' and E.passcode='${req.body.password}';`,
        (err, results) => {
            if (err) {
                return res.send(err);
            } else {
                console.log(results);
                if (results.length != 0) {
                    res.redirect(`/employee/${results[0].employeeID}`);
                } else {
                    res.send(require("./employee/employeeBadLogin.js"));
                }
            }
        }
    );
});

app.get("/employee/:id", (req, res) => {
    let id = req.params.id;
    connection.query(
        `select * from EmployeeTest t, Employee e, PoolMap p, WellTesting w 
        where e.employeeID = '${id}' and t.employeeID = '${id}' and t.testBarcode = p.testBarcode and p.PoolBarcode = w.poolBarcode`,
        (err, results) => {
            if (err) {
                return res.send(err);
            } else {
                console.log(results);
                if (results.length != 0) {
                    let firstName = results[0].firstName;
                    let lastName = results[0].lastName;

                    let text = require("./employee/employeeID.js").test;
                    text += `${firstName} ${lastName} `;
                    text += require("./employee/employeeID.js").test2;

                    let rows = parseEmployeeResults(results);
                    text += rows;
                    //console.log(rows);

                    text += require("./employee/employeeID.js").test3;
                    res.send(text);
                } else {
                    res.send("<h1>missing employee</h1>");
                }
            }
        }
    );
});

function parseEmployeeResults(results) {
    if (results.length != 0) {
        let relevantData = [];
        results.forEach((element) => {
            relevantData.push({
                testBarcode: element.testBarcode,
                collectionTime: element.collectionTime,
                result : element.result
            });
        });
        //console.log(relevantData);
        let rows = "";
        relevantData.forEach((element) => {
            rows += `<tr><td>${convertSQLToHumanDate(
                element.collectionTime
            )}</td><td>${element.result}</td></tr>`;
        });
        //console.log(rows);
        return rows;
    } else {
        return "";
    }
}
function getTestBarcodeResult(testBarcode) {
    return "";
}
function convertSQLToHumanDate(sqlDate) {
    sqlDate = "" + sqlDate;
    var date_test = sqlDate.substring(4, 15);
    let formatted = "";
    let parts = date_test.split(" ");
    switch (parts[0]) {
        case "Jan":
            formatted += "1/";
            break;
        case "Feb":
            formatted += "2/";
            break;
        case "Mar":
            formatted += "3/";
            break;
        case "Apr":
            formatted += "4/";
            break;
        case "May":
            formatted += "5/";
            break;
        case "Jun":
            formatted += "6/";
            break;
        case "Jul":
            formatted += "7/";
            break;
        case "Aug":
            formatted += "8/";
            break;
        case "Sep":
            formatted += "9/";
            break;
        case "Oct":
            formatted += "10/";
            break;
        case "Nov":
            formatted += "11/";
            break;
        case "Dec":
            formatted += "12/";
            break;
        default:
            formatted += "0/";
    }
    formatted += parts[1] + "/" + parts[2];
    console.log(formatted);
    return formatted;
}

// get well testing homepage
app.get("/labtech/labhome/welltesting", (req, res) => {
    connection.query(`select * from WellTesting`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            //console.log(results);
            if (results.length != 0) {
                let final = require("./labtech/wellTesting/wellTesting.js").text;

                final += parseWellTestingResults(results);

                final += require("./labtech/wellTesting/wellTesting.js").text2;
                res.send(final);
            } else {
                res.send(
                    require("./labtech/wellTesting/wellTesting.js").text +
                        require("./labtech/wellTesting/wellTesting.js").text2
                );
            }
        }
    });
});
// function to display wells with checkboxes
function parseWellTestingResults(results) {
    let rows = "";
    for (let index = 0; index < results.length; index++) {
        const element = results[index];
        rows += `
        <tr id="well${index + 1}">
                    <td><input type="checkbox" name="well${
                        element.wellBarcode
                    }"></td>
                    <td>${element.poolBarcode}</td>
                    <td>${element.wellBarcode}</td>
                    <td>${element.result}</td>
                </tr>
        `;
    }
    //console.log(rows);
    return rows;
}

// url to hit when adding wells
app.post("/labtech/labhome/welltesting/add", (req, res) => {
    console.log(req.body);
    if (req.body.wCode == "" || req.body.pCode == "") {
        res.redirect("/labtech/labhome/welltesting");
    } else if (req.body.pCode != "" && req.body.pCode != "") {
        // adding to WellTesting
        console.log("adding to WellTesting");

        connection.query(
            `insert ignore into Well(wellBarcode) values (${req.body.wCode});`,
            (err, results) => {
                if (err) {
                    console.log(err);
                } else {

                }
            }
        );

        connection.query(
            `insert into WellTesting(poolBarcode, wellBarcode, testingStartTime, testingEndTime, result) 
            values(${req.body.pCode}, ${req.body.wCode}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '${req.body.result}');`,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/labtech/labhome/welltesting/adderror");
                } else {
                    res.redirect("/labtech/labhome/welltesting");
                }
            }
        );
    }
});
app.get("/labtech/labhome/welltesting/adderror", (req, res) => {
    res.send(require("./labtech/wellTesting/wellTestingAddError.js"));
});

// url to hit when editing or deleting wells
app.post("/labtech/labhome/welltesting/edit", (req, res) => {
    let wellsToEdit = "";
    for (const property in req.body) {
        console.log(`${property}: ${req.body[property]}`);
        let prop = property.substring(0, 4);
        if (prop === "well") {
            wellsToEdit += property.substring(4) + ",";
        }
    }
    wellsToEdit = wellsToEdit.substring(0, wellsToEdit.length - 1);
    console.log(wellsToEdit);
    if (req.body.edit == "edit") {
        if (wellsToEdit != "") {
            connection.query(
                `select * from WellTesting t where t.wellBarcode in (${wellsToEdit});`,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                        res.send(
                            require("./labtech/wellTesting/wellsToEdit.js").text +
                                parseWellsToEdit(results) +
                                require("./labtech/wellTesting/wellsToEdit.js").text2
                        );
                    }
                }
            );
        } else {
            res.redirect("/labtech/labhome/welltesting");
        }
    } else if (req.body.delete == "delete") {
        if (wellsToEdit != "") {
            connection.query(
                `delete from Well t where t.wellBarcode in (${wellsToEdit});`,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                        res.redirect("/labtech/labhome/welltesting");
                    }
                }
            );
        } else {
            res.redirect("/labtech/labhome/welltesting");
        }
    }
});
// function to put fields to update wells
function parseWellsToEdit(results) {
    let text = "";
    results.forEach((element) => {
        text += `
        <label for="wCode">Well Barcode: </label>
        <input type="text" name="wCode" value='${element.wellBarcode}' readonly>
    
        <label for="pCode">Pool Barcode: </label>
        <input type="text" name="pCode" value='${element.poolBarcode}' readonly>

        <select name="result">
            <option value="in progress">In Progress</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
        </select>

        <br></br>
        `;
    });
    return text;
}
// url to hit when saving edited wells
app.post("/labtech/labhome/welltesting", (req, res) => {
    console.log(req.body);
    let wCode = req.body.wCode;
    let pCode = req.body.pCode;
    let result = req.body.result;
    console.log(result);
    if(typeof wCode === 'string') {
        connection.query(
            `
            UPDATE WellTesting
SET poolBarcode = '${pCode}', result = '${result}'
WHERE wellBarcode = '${wCode}';
            `,
            (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                }
            }
        );
    } else {
        for (let index = 0; index < wCode.length; index++) {
            const w = wCode[index];
            const p = pCode[index];
            const r = result[index];
            console.log(w, p, r);
            connection.query(
                `
                UPDATE WellTesting
    SET poolBarcode = '${p}', result = '${r}'
    WHERE wellBarcode = '${w}';
                `,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                    }
                }
            );
        }
    }
    res.redirect("/labtech/labhome/welltesting");
});

// get pool testing homepage
app.get("/labtech/labhome/pooltesting", (req, res) => {
    connection.query(`select * from PoolMap`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            //console.log(results);
            if (results.length != 0) {
                let final = require("./labtech/poolTesting/poolTesting.js").text;

                final += parsePoolTestingResults(results);

                final += require("./labtech/poolTesting/poolTesting.js").text2;
                res.send(final);
            } else {
                res.send(require("./labtech/poolTesting/poolTesting.js").text +require("./labtech/poolTesting/poolTesting.js").text2);
            }
        }
    });
});
function parsePoolTestingResults(results) {
    //console.log(results);
    let rowsArr = [];
    for (let index = 0; index < results.length; index++) {
        const element = results[index];
        if(rowsArr[element.poolBarcode] === undefined) rowsArr[element.poolBarcode] = element.testBarcode + ', ';
        else rowsArr[element.poolBarcode] += `${element.testBarcode}, `;
    }
    //console.log(rowsArr);
    let rows = "";
    for (let index = 1; index < rowsArr.length; index++) {
        const element = rowsArr[index];
        //console.log(element);
        rows += `
        <tr id="pool${index}">
                    <td><input type="checkbox" name="pool${
                        index
                    }"></td>
                    <td>${index}</td>
                    <td>${element}</td>
                </tr>
        `;
    }
    //console.log(rows);
    return rows;
}

// // url to hit when adding pools
app.post("/labtech/labhome/pooltesting/add", (req, res) => {
    console.log(req.body);
    if (req.body.pCode == "" || req.body['tCode[]'] == "") {
        res.redirect("/labtech/labhome/pooltesting");
    } 
    else if (req.body.pCode != "" && req.body['tCode[]'] != "") {
        // adding to WellTesting
        console.log("adding to pool testing");

        let values = "";
        let pCode = req.body.pCode;
        let tCodes = req.body['tCode[]'];
        if(typeof tCodes == 'string') {
            values = `(${tCodes}, ${pCode})`;
        } else {
            for (let index = 0; index < tCodes.length; index++) {
                const element = tCodes[index];
                if(index != tCodes.length-1) values += `(${element}, ${pCode}), `;
                else values += `(${element}, ${pCode})`;
            }
        }
        console.log(values);
        connection.query(
            `insert ignore into Pool(poolBarcode) values (${pCode});`,
            (err, results) => {
                if (err) {
                    console.log(err);
                } else {

                }
            }
        );
        connection.query(
            `insert into PoolMap(testBarcode, poolBarcode) values ${values};`,
            (err, results) => {
                if (err) {
                    console.log(err);
                    res.redirect("/labtech/labhome/pooltesting/adderror");
                } else {
                    res.redirect("/labtech/labhome/pooltesting");
                }
            }
        );
    }
});
app.get("/labtech/labhome/pooltesting/adderror", (req, res) => {
    res.send(require("./labtech/pooltesting/pooltesting.js"));
});

// // url to hit when editing or deleting pools
app.post("/labtech/labhome/pooltesting/edit", (req, res) => {
    console.log(req.body);
    let poolsToEdit = "";
    for (const property in req.body) {
        console.log(`${property}: ${req.body[property]}`);
        let prop = property.substring(0, 4);
        if (prop === "pool") {
            poolsToEdit += property.substring(4) + ",";
        }
    }
    poolsToEdit = poolsToEdit.substring(0, poolsToEdit.length - 1);
    console.log(poolsToEdit);
    if (req.body.edit == "edit") {
        if (poolsToEdit != "") {
            connection.query(
                `select * from PoolMap t where t.poolBarcode in (${poolsToEdit});`,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                        res.send(
                            require("./labtech/pooltesting/poolsToEdit.js").text +
                                parsePoolsToEdit(results) +
                                require("./labtech/pooltesting/poolsToEdit.js").text2
                        );
                    }
                }
            );
        } else {
            res.redirect("/labtech/labhome/pooltesting");
        }
    } 
 else if (req.body.delete == "delete") {
        if (poolsToEdit != "") {
            connection.query(
                `delete from PoolMap t where t.poolBarcode in (${poolsToEdit});`,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        
                    }
                }
            );
            connection.query(
                `delete from Pool t where t.poolBarcode in (${poolsToEdit});`,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                        res.redirect("/labtech/labhome/pooltesting");
                    }
                }
            );
        } else {
            res.redirect("/labtech/labhome/pooltesting");
        }
    }
});

// function to put fields to update pools
function parsePoolsToEdit(results) {
    let text = "";
    results.forEach((element) => {
        text += `
        <label for="wCode">Test Barcode: </label>
        <input type="text" name="tCode" value='${element.testBarcode}' readonly>
    
        <label for="pCode">Pool Barcode: </label>
        <input type="text" name="pCode" value='${element.poolBarcode}'>

        <br></br>
        `;
    });
    return text;
}
// url to hit when saving edited pools
app.post("/labtech/labhome/pooltesting", (req, res) => {
    //console.log(req.body);
    let arr = req.body;
    let tCodes = arr.tCode;
    let pCodes = arr.pCode;
    console.log(tCodes);
    console.log(pCodes);
    if(typeof tCodes === 'string' && typeof pCodes === 'string') {
        let q = `
            UPDATE PoolMap
    SET poolBarcode = '${pCodes}'
    WHERE testBarcode = '${tCodes}';
            `;
            console.log(q);
            connection.query(
                q,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                    }
                }
            );
    } else {
        for (let index = 0; index < tCodes.length; index++) {
            const tCode = tCodes[index];
            const pCode = pCodes[index];
            let q = `
            UPDATE PoolMap
    SET poolBarcode = '${pCode}'
    WHERE testBarcode = '${tCode}';
            `;
            console.log(q);
            connection.query(
                q,
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                    }
                }
            );
        }
    }
    res.redirect("/labtech/labhome/pooltesting");
});

// labtech home routes
app.get('/labtech', (req,res) => {
    res.send(require('./labtech/labtechhome').loginlabtech);
 });
 app.get('/labtech/labhome', (req,res) => {
    res.send(require('./labtech/labhometest').labhome);
 });
 app.get('/labtech/testcollection', (req,res) => {
    res.send(require('./labtech/testCollection').testCollection);
 });

 app.delete('/labtech/testcollection/delete/:id', (req,res) => {
    const{id} = req.params;
    console.log(id);
    connection.query('DELETE FROM covidtest.EmployeeTest WHERE testBarcode = ?',[id] ,(err,results) => {
                if(!err){
                   return res.send("deleted success") 
                }
                else{
                    throw err;
                }
            });
 });


app.post("/labtech/testCollection/add", (req, res) => {  
    if (req.body.testBarcode == "" || req.body.employeeID == "") {
        res.redirect("/labtech/labhome");
    } else if (req.body.testBarcode != "" && req.body.employeeID != "") {
        console.log(req.body);
        connection.query(
            `insert into EmployeeTest(testBarcode, employeeID, collectionTime) values('${req.body.testBarcode}', '${req.body.employeeID}', CURRENT_TIMESTAMP);`,
            (err, results) => {
                if (err) {
                    res.send('error')
                } else {
                    console.log('works');
                    res.redirect("/labtech/testcollection");
                }
            }
        );
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " + PORT));
