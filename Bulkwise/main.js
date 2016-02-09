/**
 * Created by harman on 08/02/2016.
 */


//import
var express = require('express');
var main = express.Router();


/**
 * Main get method for welcome
 */
main.get('/', function(req, res, next) {

        res.send({message: 'success', data: 'Welcome to Bulkwize'});


});

//exporting module
module.exports = main;