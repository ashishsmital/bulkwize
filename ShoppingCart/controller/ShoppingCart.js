/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages
var express = require('express');
var shoppingcart = express.Router();
var ShoppingCartModel = require('../model/ShoppingCartModel.js');
var _ = require('underscore');
var Bulkwize = "Bulkwize";
var moment = require('moment');
var numeral = require('numeral');

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
                var sum = 0;
				var totalCartValue = 0;
				// calculate the total number of products in the cart
                _.each(result.data[0].Bulkwize.products, function (ele) {

                    sum += ele.variants.length;
					// calculate the total cart value
					_(ele.variants).each(function (eleV) {
						console.log("Inside variants loop");
						totalCartValue += eleV.productCountInCase*eleV.quantity*eleV.productMRPUnit*(100-eleV.productDiscountPercentage)/100;

					});
				
                });
                _.extend(result.data[0].Bulkwize, {'totalCount': sum});
				_.extend(result.data[0].Bulkwize, {'totalCartValue': numeral(totalCartValue).format('Rs0,0.00')});
				
            }

        }
        res.send(result);
    });
});


/**
 * get Shoppingcart
 */
shoppingcart.get('/', function (req, res, next) {
	// check if there is a cart for the session and then check if there is an previous un-checked out cart for the user
    ShoppingCartModel.getByAttribute("session_id", req.sessionID, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        } else {
            if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                console.log('the retrieved cart is ' + result.data);
                var sum = 0
				var totalCartValue = 0;
                _.each(result.data[0].Bulkwize.products, function (ele) {

                    sum += ele.variants.length;
					// calculate the total cart value
					_(ele.variants).each(function (eleV) {
						console.log("Inside variants loop");
						totalCartValue += eleV.productCountInCase*eleV.quantity*eleV.productMRPUnit*(100-eleV.productDiscountPercentage)/100;

					});

                });
                _.extend(result.data[0].Bulkwize, {'totalCount': sum});
				console.log("The count of items in shopping cart is " + result.data[0].Bulkwize.totalCount);
				_.extend(result.data[0].Bulkwize, {'totalCartValue': numeral(totalCartValue).format('Rs0,0.00')});
				//res.send(result);
            }else{ // check if there is any unchecked out cart for the user from previous session.
				if(req.user != undefined && req.user != null && req.user.user != undefined && req.user.user != null ){
						ShoppingCartModel.getUncheckedOutCart(req.user.user, function (error, result) {
					if (error) {
                        console.log('Error fetching unchecked out shopping cart');
                    }else {
                        console.log('Number of  existing unchecked out shopping cart for this user  - '+ result.data.length)
            						
						if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                            console.log('Got unchecked out shopping cart for the user ')
                            var object  = result.data[0].Bulkwize;
							
                            object.session_id = req.sessionID;
                            
                            ShoppingCartModel.save(object,function(error,result){
                                console.log('Got un-checked out shopping cart for the user and associating it  with the current session ')
                                if(result && result.data.length >0){
                                    return done(null, user);
									
									//return req.res.status(200).json({message:"Successfully logged in"});
                                }
                            });
							//res.send(result);
                        }
					}
				});
				}
				
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
					data.createdAt = result.data[0].Bulkwize.createdAt;
					data.workflowState = "updated";
                }
            }else{
				data.createdAt =  moment(new Date()).utcOffset("+05:30").format();
				data.workflowState = "created";
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

	var queryData = {key: '', value: ''};

    populateKeyValue(req,data,queryData);

    ShoppingCartModel.getByAttribute("id", "com.bulkwise.Cart::" + req.user.user, function (error, result) {
        if (error) {
            console.log('No previous cart details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
                var shoppingCartfromDB = result.data[0].Bulkwize;
                var shippingAddFromSite = data.shipping_address;

                if (shippingAddFromSite != null) {
					console.log("Found shipping details posted from app " + JSON.stringify(shippingAddFromSite));
                    shoppingCartfromDB.shipping_address = shippingAddFromSite;
					console.log("The shipping details in the cart after adding it from UI are  " + JSON.stringify(shoppingCartfromDB));
                    data = result.data[0].Bulkwize;
					
					data.createdAt = result.data[0].Bulkwize.createdAt;
					data.workflowState = "ShippingAddressAdded";
					//saving final data
					saveCart(data, res);

                }


            }
        }

        

    });


});

/**
 * Checkout
 */
shoppingcart.post('/checkout', function (req, res, next) {

    var data = req.body;
	if(req.user == undefined && req.user == null){
		return req.res.status(401).json({message:"Please login before you can checkout !"});
	}
    populateSessionDetails(req, data);

	var queryData = {key: '', value: ''};

    populateKeyValue(req,data,queryData);
	
    ShoppingCartModel.getUserById("id", "com.bulkwise.Cart::" + req.user.user, function (error, result) {
        if (error) {
            console.log('No details for the user');
        } else {
            if (result.data != null && result.data.length > 0) {
				if (result) {
					res.send(result);
				} else {
					return res.status(404).send(error);
				}
                
            }
        }
      

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
				data.createdAt = result.data[0].Bulkwize.createdAt;
				data.workflowState = "updated";

            }
        }

        //saving final data
		if(data.products.length > 0){
			console.log("Inside delete product of shopping cart, after removing this product there are still some other products left in the cart and hence saving the cart");
			saveCart(data, res);
		}else{
			console.log("Inside delete product of shopping cart, after removing this product there are no more products left in the cart and hence deleting the cart");
			deleteCart(data,res);
		}

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
	console.log("The card details being saved are " + JSON.stringify(data));
	if(data.workflowState == undefined || data.workflowState == null){
		data.workflowState = "updated";
	}
    ShoppingCartModel.save(data, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
};

/**
 *
 * @param data
 * @param res
 */
var deleteCart = function (data, res) {
    ShoppingCartModel.delete(data.id, function (error, result) {
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
	console.log("The user name associated with shopping cart incoming request is " + JSON.stringify(req.user));
	if(req.user != undefined && req.user !=null){
		console.log("The user objects exists with request & the name associated with shopping cart incoming request is " + JSON.stringify(req.user.user));
		console.log("The user is logged in and hence associating the shopping cart id to the user's mobilenumber");
		queryData['key'] = 'id';
        queryData['value'] ='com.bulkwise.Cart::'+req.user.user;
		data.id='com.bulkwise.Cart::'+req.user.user;
		data.customer_id=req.user.user;
	}else{
		console.log("User not found and hence associating the shopping cart with user's current session id -- " + data.session_id);
		queryData['key'] = 'session_id';
        queryData['value'] = data.session_id;
		data.id='com.bulkwise.Cart::'+data.session_id;
		data.customer_id=data.session_id;
	}
    /*if (data.customer_id == '') {
        queryData['key'] = 'session_id';
        queryData['value'] = data.session_id;
    } else {
        queryData['key'] = 'id';
        queryData['value'] ='com.bulkwize.Cart::'+data.id;
    }*/


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



