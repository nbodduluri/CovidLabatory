let text = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/style.css">
    <title>Employee Testing</title>
</head>
<body>
    <div style="text-align: center;">
        <h1>Well Testing</h1>
        <form action ="/labtech/labhome/welltesting/add" method = "POST">
            
            <label for="wCode">Well Barcode: </label>
            <input type="text" name="wCode"><br>
        
            <label for="pCode">Pool Barcode: </label>
            <input type="text" name="pCode"><br>

            <select name="result">
                <option value="in progress">In Progress</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
            </select>
        
            <br><input type="submit" value="add">
            
        </form>

        <form action ="/labtech/labhome/welltesting/edit" method = "POST">
            <table class='center'>
                <tr>
                    <td></td>
                    <th>Pool Barcode</th>
                    <th>Well Barcode</th>
                    <th>Result</th>
                </tr>`;
                
let text2 =  `          </table>

            <br><input type="submit" value="edit" name="edit">
            <input type="submit" value="delete" name="delete">

        </form>
    </div>
    
</body>
</html>
`;
module.exports.text = text;
module.exports.text2 = text2;