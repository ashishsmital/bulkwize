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
var morgan  = require('morgan');


//post body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('morgan')('combined'));

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
	console.log("Inside serialize user and the value of user is " + JSON.stringify(user));
    done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log("Inside de-serialize user and the value of user is " + JSON.stringify(user));
    done(null, user);
});


passport.use(new LocalStrategy({passReqToCallback:true},function(req,username, password, done) {
    process.nextTick(function() {
        // Auth Check Logic
        console.log("Inside Authentication, the incoming username is --"+username+" & password is  --" + password);
        UserModel.getByAttribute("mobileNumber", username, function (error, result) {

            console.log('The number of records in DB with username '+username + " are -- "+ result.data.length);
            if (result && result.data.length>0) {
                name  = result.data[0].Bulkwize.mobileNumber;
                pass = result.data[0].Bulkwize.password;
                if(password == pass)
                    var user ={'user':name};
					req.session.user = user;
                console.log("The Username is " + name  + " & the session id is   "  + req.sessionID);
                ShoppingCartModel.getByAttribute("session_id", req.sessionID, function (error, result) {
                    if (error) {
                        console.log('Error updating shopping cart');
                    } else {
                        console.log('There is no existing shopping cart for this users session - '+ result.data.length)
                        var res = req.res;
                        if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                            console.log('Got shopping cart for the session ')
                            var object  = result.data[0].Bulkwize;
                            object.customer_id = name;
                            object.id ='com.bulkwise.Cart::'+name;
                            ShoppingCartModel.save(object,function(error,result){
                                console.log('Got shopping cart for the session and saving for the user ')
                                if(result && result.data.length >0){
                                    return done(null, user);
									
									//return req.res.status(200).json({message:"Successfully logged in"});
                                }
                            });
                        }

                    }
                });

                return done(null, user);
				//return req.res.status(200).json({message:"Successfully logged in"});
            } else {
                //return done(null, false,{message:'Incorrect password'});
				return req.res.status(401).json({message:"Incorrect User name or Password"});
            }
        });

    });
}));



//listerner
app.listen(port);
console.log('Magic happens on port ' + port);

app.all('/*',function (req, res, next) {

    //console.log("the incoming request is --"+req.body +" and the URL is -->" + req.url);
	console.log("Inside App all method, Request body is -- " + JSON.stringify(req.body));
	console.log("the session id with incoming request is  -- " + req.sessionID);
    // Website you wish to allow to connect
	if(req.get('Origin') != null){
		res.setHeader('Access-Control-Allow-Origin', req.get('Origin'));
	}

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


// we'll create our controller here
//app.use('/', main);

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
	console.log("Inside successful authentication method and the logged in user name is --" + JSON.stringify(req.body));
	
	return req.res.status(200).json({message:"Successfully logged in"});
    //res.redirect('/user/' + req.user.name);
  });
  
app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.clearCookie('connect.sid');
  return req.res.status(200).json({message:"Successfully logged out"});
});


// apply the controller to our application
app.use('/category', category);

var isAuthenticated = function (req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    console.log("Is user currently authenticated ? -- " + req.isAuthenticated());
	
	console.log("The session from incoming user is  -- " + JSON.stringify(req.session));


    if(req.isAuthenticated()){
        console.log("The user authentication is - " + req.isAuthenticated() + " and hence allowing to process");
        return next();
    }else if(req.url !='/order' && req.url != '/shoppingcart/shippingDetails' && !req.url.startsWith('/user')){
        console.log("The request URL is neither order nor user and hence it does not mandate authentication  and hence allowing to process");
        return next();
    }else if(req.url.startsWith('/user/checkMobileNumber') || req.url.startsWith('/user/forgotpassword')){
        console.log("The request URL is post user hence it does not mandate authentication  and hence allowing to process");
        return next();
    }else if(req.url.startsWith('/user') && (req.method=='POST' || req.method=='OPTIONS')){
        console.log("The request URL is post user hence it does not mandate authentication  and hence allowing to process");
        return next();
    }else if((req.url.startsWith('/order') || req.url.startsWith('/user') )&& req.isAuthenticated()){
        console.log("The URL mandates authentication and user authentication is "+ req.isAuthenticated() +"  and hence allowing to process");
        return next();
    }else{
		console.log("The URL mandates authentication and user authentication is "+ req.isAuthenticated() +"  and hence redirecting to login");
			// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
		res.status(401).json({message:"Access denied. Please login"});
	}

    
}
app.use('/products', products);
app.use('/shoppingcart', shoppingcart);
app.use('/supplier', supplier);
app.use('/promotion', promotion);
app.use('/order', order);
app.use('/user', user);
console.log("The dir name is -- "+ __dirname+'../appcontent');
app.use('/appcontent',express.static(__dirname+'/../appcontent'));

