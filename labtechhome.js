let loginlabtech = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<link rel="stylesheet" href="css/style.css">
<!-- jQuery and JS bundle w/ Popper.js -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
    <title>Login Page</title>
    <style>
        form{
        width: 50%;
        margin: auto;
        }
    .loginbutton{
    
    margin-left: 30%;
    }
    h3{
    text-align: center
    }
    </style>
</head>
<body>
    <br>
    <h3>Login page</h3>
    
    <form id="form">
        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-2 col-form-label">ID</label>
          <div class="col-sm-10">
            <input  class="form-control" id="inputEmail3" placeholder="ID" required/>
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
          <div class="col-sm-10">
            <input type="password" class="form-control" id="inputPassword3" placeholder="Password" required/>
          </div>
        </div>
       
       
        <div class="form-group row">
          <div class="col-sm-12">
          <button id='LoginCollector' onclick="collectorData(event)" class="loginbutton" type="submit" class="btn btn-primary">Login Collector</button>
            <button id='LoginLab'  onclick="LabLoginData(event)" class="loginbutton" type="submit" class="btn btn-primary">Lab Login</button>
          </div>
        </div>
      </form>
      <script>
          
          let collectorData = (e) => {
            let labtech = [];
            let email = "";
            let password = "";
            let page = 0;
            
            
            e.preventDefault();
            email  = document.getElementById('inputEmail3').value;
            
            password  = document.getElementById('inputPassword3').value;
               page = 1;
                getLabTech(email,password,page)
                
          }
          let LabLoginData = (e) => {
            e.preventDefault();
            email  = document.getElementById('inputEmail3').value;
            
            password  = document.getElementById('inputPassword3').value;
               page = 2;
                getLabTech(email,password,page)
                
          }
          getLabTech = (e,p,g) => {
              fetch('http://localhost:5000/labEmployeeData').then(res => {
                  return res.json();
              }).then((obj) => {
                  labtech=obj
                  printLabTech(e,p,g)
                                 
              }).catch((error)=>{
                  //console.log('error')
              })
            }
           
            
            printLabTech= (e,p,g) =>{
                console.log(labtech.data[0].password)
                for(var i = 0; i < labtech.data.length; i++){
                    console.log(e)
                    console.log(p)
                    if(labtech.data[i].labID == e && labtech.data[i].password == p && g==1){
                        console.log(true)
                        window.location.href = "http://localhost:5000/labtech/testcollection";
                    }
                    if(labtech.data[i].labID == e && labtech.data[i].password == p && g==2){
                        window.location.href = "http://localhost:5000/labtech/labhome";
                    }
                }
                
                
            }
      </script>
</body>
</html>`

module.exports.loginlabtech=loginlabtech;