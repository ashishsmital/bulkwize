/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages
var express = require('express');
var shoppingcart = express.Router();
var ShoppingCartModel = require('../model/ShoppingCartModel.js');
var _ = require('underscore');
var Bulkwize = "Bulkwize";


/**
 * get Shoppingcart
 */
shoppingcart.get('/user/:userid', function (req, res, next) {

    ShoppingCartModel.getByAttribute("id", 'com.bulkwise.Cart::' + req.params['userid'], function (error, result) {
        if (error) {
            return res.status(400).send(error);
        } else {
            if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                console.log('the retrieved cart is ' + result.data);
                var sum = 0
                _.each(result.data[0].Bulkwize.products, function (ele) {

                    sum += ele.variants.length;

                });
                _.extend(result.data[0].Bulkwize, {'totalCount': sum});
            }

        }
        res.send(result);
    });
});


/**
 * get Shoppingcart
 */
shoppingcart.get('/', function (req, res, next) {

    ShoppingCartModel.getByAttribute("session_id", req.sessionID, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        } else {
            if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                console.log('the retrieved cart is ' + result.data);
                var sum = 0
                _.each(result.data[0].Bulkwize.products, function (ele) {

                    sum += ele.variants.length;

                });
                _.extend(result.data[0].Bulkwize, {'totalCount': sum});
	        console.log("The count of items in shopping cart is " + result.data[0].Bulkwize.totalCount);
            }


        }
        res.send(result);
    });
});

/**
 * Save Shoppingcart
 */
shoppingcart.put('/', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);

    var queryData = {key: '', value: ''};

    populateKeyValue(req,data,queryData);

    ShoppingCartModel.getByAttribute(queryData['key'], queryData['value'], function (error, result) {
        if (error) {
            console.log('No previous cart details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
                var pdtFromSite = data.products;

                if (pdtFromSite != null) {

                    var match = false;
                    var pdtFromDB = result.data[0].Bulkwize.products;

                    _.each(pdtFromSite, function (ele) {

                        var prod = _.findWhere(pdtFromDB, {'id': ele.id});
                        if (prod !== null && !_.isUndefined(prod)) {
                            _.each(ele.variants, function (ele) {

                                var variant = _.findWhere(prod.variants, {'sku_id': ele.sku_id});
                                if (variant != null) {
                                    variant.quantity = ele.quantity;
                                } else {
                                    prod.variants.push(ele);
                                }

                            });
                        } else {
                            pdtFromDB.push(ele);
                        }

                    });

                    data.products = result.data[0].Bulkwize.products;
                }
            }
        }

        //saving final data
        saveCart(data, res);
    });

});

/**
 * Save Shoppingcart shipping details
 */
shoppingcart.put('/shippingDetails', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);


    ShoppingCartModel.getByAttribute("id", "com.bulkwise.Cart::" + data.customer_id, function (error, result) {
        if (error) {
            console.log('No previous cart details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
                var shoppingCartfromDB = result.data[0].Bulkwize;
                var shippingAddFromSite = data.shipping_address;

                if (shippingAddFromSite != null) {
                    shoppingCartfromDB.shipping_address = shippingAddFromSite;
                    data = result.data[0].Bulkwize;

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
shoppingcart.delete('/product', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);

    var queryData = {key: '', value: ''};

    populateKeyValue(req,data,queryData);

    ShoppingCartModel.getByAttribute(queryData['key'], queryData['value'], function (error, result) {
        if (error) {
            console.log('No previous cart details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
                var pdtFromSite = data.products;

                if (pdtFromSite != null) {

                    var pdtFromDB = result.data[0].Bulkwize.products;

                    _.each(pdtFromSite, function (ele) {

                        var pdt = _.findWhere(pdtFromDB, {'id': ele.id});
                        pdtFromDB = _.without(pdtFromDB, pdt);

                    });
                    result.data[0].Bulkwize.products = pdtFromDB;
                    data = result.data[0].Bulkwize;
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
shoppingcart.delete('/variants', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);

    var queryData = {key: '', value: ''};

    populateKeyValue(req,data,queryData);

    ShoppingCartModel.getByAttribute(queryData['key'], queryData['value'], function (error, result) {
        if (error) {
            console.log('No previous cart details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
                var pdtFromSite = data.products;

                var pdtFromDB = result.data[0].Bulkwize.products;

                _.each(pdtFromSite, function (ele) {

                    var prod = _.findWhere(pdtFromDB, {'id': ele.id});

                    if (prod !== null) {
                        _.each(ele.variants, function (ele) {

                            var variant = _.findWhere(prod.variants, {'sku_id': ele.sku_id});
                            prod.variants = _.without(prod.variants, variant);

                        });
                    }

                    data = result.data[0].Bulkwize;

                });
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
var saveCart = function (data, res) {
    ShoppingCartModel.save(data, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
};


var populateSessionDetails = function (req, data) {

    data.session_id = req.sessionID;


};
var populateKeyValue = function (req, data, queryData) {

    if (data.customer_id == '') {
        queryData['key'] = 'session_id';
        queryData['value'] = data.session_id;
    } else {
        queryData['key'] = 'id';
        queryData['value'] ='com.bulkwize.Cart::'+data.id;
    }


};


var populateVariants = function (dbVariants, siteVariants) {
    console.log(dbVariants + " db variants")
    if (siteVariants != null) {
        siteVariants.forEach(function (ele, index) {
            console.log("site variant  " + ele.sku_id);
            dbVariants.forEach(function (dbvariant, index) {
                console.log("dbvariant dbvariant  " + dbvariant);
                if (ele.sku_id == dbvariant.sku_id) {
                    console.log("matched");
                    ele.quantity = dbvariant.quantity;
                }
            });
        });

    }
};



// export product module
module.exports = shoppingcart;



