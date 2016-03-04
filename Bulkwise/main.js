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



main.post('/login',
    passport.authenticate('local', {
            successRedirect: '/loginSuccess',
            failureRedirect: '/loginFailure'
    })
);



main.get('/loginFailure', function(req, res, next) {
    res.status(401).json({message:"Unauthorized"});
});

main.get('/loginSuccess', function(req, res, next) {
    req.res.status(200).json({message:"Successfully logged in Devaraj"});
});

//exporting module
module.exports = main;