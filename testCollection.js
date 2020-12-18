let testCollection = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        h1{
          text-align: center;
        }
        main{
          width:50%;
          margin: 50px auto;
          text-align:center
        }
        table{
          margin: 50px auto;
        }
        table,th,td{
          border-collapse: collapse;
          border: 1px solid #000;
        }
        th,td{
          padding:5px;
        }
    </style>
</head>
<body>
    <h1>Test Collection</h1>
    <main>
      <label for="">Employee ID:</label>
      <input type="text" id="employeeid-input">
      <br>
      <label for="">Test Barcode:</label>
      <input type="text" id="testBarcodeid-input">
      <br>
      <button id="add-id-btn">Add</button>
      <br>
      <br>
      <table id="table">
          <thead>
            <th>Employee ID</th>
            <th>TestBarcode</th>
            <th>Delete</th>
          </thead>
          <tbody></tbody>
      </table>
    </main>
    <script src="/index.js"></script>
</body>
</html>`

module.exports.testCollection = testCollection;