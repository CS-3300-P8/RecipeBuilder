//https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var cors = require('cors');

app.use(express.json());
app.use(cors());


app.post('/api/store_ingredient', function (req, res) {
   const { name, category } = req.body;

   // Add logic to store the item (for now, log to console or save to mock storage)
   console.log("Ingredient saved:", { name, category });

   res.status(200).send("Item saved successfully.");
});


//creates the web server
var server = app.listen(3001, function () {
   console.log("Express App running at http://127.0.0.1:3001/");
})