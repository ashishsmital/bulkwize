/**
 * Created by harman on 04/02/2016.
 */

// index.js

// BASE SETUP
// ==============================================

var express = require('express');
var app     = express();
var port    =   process.env.PORT || 8080;
var product = require('./Products')

// START THE SERVER
// ==============================================
app.listen(port);

console.log('Magic happens on port ' + port);


// we'll create our controller here

// get an instance of router
var router = express.Router();

// home page route (http://localhost:8080)
router.get('/:name', function(req, res) {

    res.send(req.params.name+' you are in the home page!');
});

// about page route (http://localhost:8080/about)
router.get('/about', function(req, res) {
    res.send('im the about page!');
});

// apply the controller to our application
app.use('/', router);