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
var LocalStrategy = require('passport-local').Strategy;
var _ = require('underscore');

//importing middleware modules
var main =require('./main.js');
var category = require('category/controller/Category.js');
var products = require('products/controller/Products.js');
var shoppingcart = require('shoppingcart/controller/ShoppingCart.js');
var ShoppingCartModel = require('shoppingcart/model/ShoppingCartModel.js');
var supplier = require('supplier/controller/Supplier.js');
var promotion = require('promotion/controller/Promotion.js');
var user = require('user/controller/User.js');
var UserModel = require('user/model/UserModel.js');
var order = require('order/controller/Order.js');


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
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({passReqToCallback:true},function(req,username, password, done) {
    process.nextTick(function() {
        // Auth Check Logic
        console.log(username+'  '+password)
        UserModel.getByAttribute("mobileNumber", username, function (error, result) {

            if (result && result.data.length>0) {
                name  = result.data[0].Bulkwize.mobileNumber;
                pass = result.data[0].Bulkwize.password;
                if(password == pass)
                    var user ={'user':name};
                console.log('Username' + name)
                ShoppingCartModel.getByAttribute("session_id", req.sessionID, function (error, result) {
                    if (error) {
                        console.log('Error updating shopping cart');
                    } else {
                        console.log('result from shopping cart'+ result.data.length)
                        var res = req.res;
                        if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                            console.log('Got shopping cart for the session ')
                            var object  = result.data[0].Bulkwize;
                            object.customer_id = name;
                            object.id ='com.bulkwize.Cart::'+name;
                            ShoppingCartModel.save(object,function(error,result){
                                console.log('Got shopping cart for the session and saving for the user ')
                                if(result && result.data.length >0){
                                    return done(null, user);
                                }
                            });
                        }

                    }
                });

                return done(null, user);
            } else {
                return done(null, false,{message:'Incorrect password'});
            }
        });

    });
}));



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
    //next();
    isAuthenticated(req, res, next);
});

var isAuthenticated = function (req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    console.log(req.isAuthenticated());
    if (req.isAuthenticated() || req.url=='/login' || req.url=='/' || req.url=='/shoppingcart'|| req.url=='/user' )
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
}


// we'll create our controller here
app.use('/', main);

// apply the controller to our application
app.use('/category', category);
app.use('/products', products);
app.use('/shoppingcart', shoppingcart);
app.use('/supplier', supplier);
app.use('/promotion', promotion);
app.use('/order', order);
app.use('/user', user);
console.log("The dir name is -- "+ __dirname+'../appcontent');
app.use('/appcontent',express.static(__dirname+'/../appcontent'));


