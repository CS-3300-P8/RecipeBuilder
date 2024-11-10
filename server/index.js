//https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,"index.html"));
 })

 //temp location of static assets
 app.use(express.static('public'));

 app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.query.first_name,
       last_name:req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })

 app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })

//creates the web server
var server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})