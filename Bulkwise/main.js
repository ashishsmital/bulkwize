/**
 * Created by harman on 08/02/2016.
 */


//import
var express = require('express');
var main = express.Router();
var passport =require('passport');

/**
 * Main get method for welcome
 */
main.get('/login', function(req, res, next) {
    res.sendfile ('views/login.html');
});

/**
 * Main get method for welcome
 */
main.get('/', function(req, res, next) {
    res.sendfile ('views/main.html');
});


/**
 * Main get method for registration
 */
main.get('/registration', function(req, res, next) {
    res.sendfile ('views/registration.html');
});



main.post('/login', function(){
	
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
	passport.authenticate('local', {
            successRedirect: '/loginSuccess',
            failureRedirect: '/loginFailure'
    })
}
    
);



main.get('/loginFailure', function(req, res, next) {
    res.status(401).json({message:"Unauthorized"});
});

main.get('/loginSuccess', function(req, res, next) {
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    req.res.status(200).json({message:"Success"});
});

//exporting module
module.exports = main;