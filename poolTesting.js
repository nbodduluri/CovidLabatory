let text = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/style.css" />
        <title>Pool Testing</title>
        <script>
            let counter = 0;
            function addTestRow() {
                console.log('counter ' + counter);
                let div1 = document.createElement("div");
                div1.id = 'row' + counter;;
                console.log(div1.id);
                div1.innerHTML = document.getElementById(
                    "newTestRow"
                ).innerHTML;

                let button1 = document.createElement("text");
                button1.id = 'button' + counter;
                button1.onclick = function () {
                    deleteTestRow(div1.id);
                };
                button1.innerText = "delete";
                div1.appendChild(button1);

                document.getElementById("testRows").appendChild(div1);
                counter++;
            }
            function deleteTestRow(id) {
                console.log(id);
                let thing = document.getElementById(id);
                document.getElementById("testRows").removeChild(thing);
            }
        </script>
    </head>
    <body>
        <div style="text-align: center;">
            <h1>Pool Testing</h1>
            <div style="border: solid black 1px;" class="centerDiv">
            <form action="/labtech/labhome/pooltesting/add" method="POST">
                <label for="pCode">Pool Barcode: </label>
                <input type="text" name="pCode" /><br />

                <div>
                    <label for="tCode[]">Test Barcode(s): </label>
                    <div id="testRows">
                        <input type="text" name="tCode[]" />
                    </div>
                </div>
                <br/>
                
                <input type="submit" value="submit pool" />
            </form> 
            <br/>
        </div> 
        <button onclick="addTestRow()">Add rows</button>

            <form action="/labtech/labhome/pooltesting/edit" method="POST">
                <table class="center">
                    <tr>
                        <td></td>
                        <th>Pool Barcode</th>
                        <th>Test Barcodes</th>
                    </tr>
`;
                
let text2 =  `</table>

<br /><input type="submit" value="edit" name="edit" />
<input type="submit" value="delete" name="delete" />
</form>
</div>

<div id="newTestRow" style="display: none">
<input type="text" name="tCode[]" />
</div>
</body>
</html>
`;
module.exports.text = text;
module.exports.text2 = text2;