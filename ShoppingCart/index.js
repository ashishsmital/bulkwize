/**
 * Created by harman on 06/02/2016.
 */
// index.js

// BASE SETUP

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var session = require('express-session');

var shoppingcart = require('./controller/ShoppingCart.js');


//post body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//session
app.use(session({
    secret: 'bulkwizesecret-12340987',
    resave: true,
    saveUninitialized: true
}));

// we'll create our controller here

app.listen(port);
console.log('Magic happens on port ' + port);


// apply the controller to our application
app.use('/shoppingcart', shoppingcart);



