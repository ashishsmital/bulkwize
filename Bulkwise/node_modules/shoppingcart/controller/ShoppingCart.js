/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages
var express = require('express');
var shoppingcart = express.Router();
var ShoppingCartModel = require('../model/ShoppingCartModel.js');



/**
 * Save Shoppingcart
 */
shoppingcart.put('/', function(req, res, next) {


    ShoppingCartModel.save(req.body, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});



/**
 * Save Shoppingcart
 */
shoppingcart.get('/', function(req, res, next) {


    ShoppingCartModel.getByAttribute('type', 'com.bulkwise.Cart', function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
});



// export product module
module.exports = shoppingcart;



