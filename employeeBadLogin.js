let test = `
<!DOCTYPE html>
<html>
    <head>
    <title>Employee Login</title>s
    <link rel="stylesheet" href="/css/style.css">
    </head>
<body style="text-align:center">
<div>
<h1>Employee Login</h1>
<h3>Credentials not found! Please try again</h3>
<form action ="/employee" method = "POST">
    <div class="loginForm">

    <label for="email">email</label>
    <input type="text" name="email"><br>

    <label for="password">password</label>
    <input type="text" name="password"><br>

    <input type="submit" value="Submit">
    </div>
</form>
</div>
</body>
</html>
`

module.exports = test;