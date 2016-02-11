/**
 * Created by harman on 04/02/2016.
 */

// index.js

// BASE SETUP
var express = require('express');
var app     = express();
var port    =   process.env.PORT || 8080;
var bodyParser = require('body-parser');

//importing middleware modules
var main =require('./main.js');
var products = require('products/controller/Products.js');
var shoppingcart = require('shoppingcart/controller/ShoppingCart.js');


//post body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//listerner
app.listen(port);
console.log('Magic happens on port ' + port);


// we'll create our controller here
app.use('/', main);
// apply the controller to our application
app.use('/products', products);
app.use('/shoppingcart', shoppingcart);


