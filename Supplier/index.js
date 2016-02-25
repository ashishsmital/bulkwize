/**
 * Created by harman on 06/02/2016.
 */
// index.js

// BASE SETUP

var express = require('express');
var app     = express();
var port    =   process.env.PORT || 8080;
var bodyParser = require('body-parser');

var supplier = require('./controller/Supplier.js');


//post body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// we'll create our controller here

app.listen(port);
console.log('Magic happens on port ' + port);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// apply the controller to our application
app.use('/supplier', supplier);



