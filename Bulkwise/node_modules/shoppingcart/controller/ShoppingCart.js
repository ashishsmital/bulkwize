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
shoppingcart.put('/', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);

    ShoppingCartModel.get( data.customer_id, function (error, result) {
        if (error) {
            console.log('No previous cart details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
                var pdtFromSite = data.products;

                if (pdtFromSite != null) {

                    var match = false;
                    var pdtFromDB = result.data[0].bulkwize.products;

                    for (var i = 0; i < pdtFromSite.length; i++) {

                        pdtFromDB.forEach(function (ele, index) {

                            if (ele.id === pdtFromSite[i].id) {
                                ele.quantity = pdtFromSite[i].quantity;
                                match = true;
                            }

                        });

                        if (!match) {
                            pdtFromDB.push(pdtFromSite[i]);
                        }

                    }
                    data = result.data[0].bulkwize;
                }
            }
        }

        //saving final data
        saveCart(data, res);

    });


});



/**
 * delete products from Shoppingcart
 */
shoppingcart.delete('/', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);

    ShoppingCartModel.get( data.customer_id, function (error, result) {
        if (error) {
            console.log('No previous cart details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
                var pdtFromSite = data.products;

                if (pdtFromSite != null) {

                    var pdtFromDB = result.data[0].bulkwize.products;

                    for (var i = 0; i < pdtFromSite.length; i++) {

                        pdtFromDB =  pdtFromDB.filter(function (ele) {

                            return ele.id != pdtFromSite[i].id;

                        });

                    }
                    result.data[0].bulkwize.products = pdtFromDB;
                    data = result.data[0].bulkwize;
                }
            }
        }

        //saving final data
        saveCart(data, res);

    });


});

/**
 *
 * @param data
 * @param res
 */
function saveCart(data, res) {
    ShoppingCartModel.save(data, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
}


var populateSessionDetails = function (req, data) {

    data.session_id = req.session.id;


};


/**
 * get Shoppingcart
 */
shoppingcart.get('/user/:userid', function (req, res, next) {

    ShoppingCartModel.get(req.params['userid'], function (error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
});

// export product module
module.exports = shoppingcart;



