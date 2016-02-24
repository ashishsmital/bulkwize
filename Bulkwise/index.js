/**
 * Created by harman on 04/02/2016.
 */

// index.js

// BASE SETUP
var express = require('express');
var app     = express();
var port    =   process.env.PORT || 8080;
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

//importing middleware modules
var main =require('./main.js');
var category = require('category/controller/Category.js');
var products = require('products/controller/Products.js');
var shoppingcart = require('shoppingcart/controller/ShoppingCart.js');
var supplier = require('supplier/controller/Supplier.js');



//post body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//session
app.use(session({
    secret: 'bulkwizesecret-12340987',
    resave: true,
    saveUninitialized: true
}));


//initalize passport and app
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function(userId, done) {
    done(null, userId);
});

//listerner
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

// we'll create our controller here
app.use('/', main);
// apply the controller to our application
app.use('/category', category);
app.use('/products', products);
app.use('/shoppingcart', shoppingcart);
app.use('/supplier', supplier);
console.log("The dir name is -- "+ __dirname+'../appcontent');
app.use('/appcontent',express.static(__dirname+'/../appcontent'));


