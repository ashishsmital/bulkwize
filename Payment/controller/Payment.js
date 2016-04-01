/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages
var express = require('express');
var payment = express.Router();
var paymentModel = require('../model/PaymentModel.js');
var orderModel = require('order/model/OrderModel.js');
var userModel = require('user/model/UserModel.js');
var _ = require('underscore');
var moment = require('moment');
var numeral = require('numeral');
var RestClient = require('node-rest-client').Client;
var pmntClient = new RestClient();




/**
 * Make Payment
 */
payment.post('/:orderId', function (req, res, next) {
	console.log('inside payment post method');
    var data = req.body;
	/*if(req.user == undefined && req.user == null){
		return req.res.status(401).json({message:"Please login before you can checkout !"});
	}*/

	orderModel.get(req.params['orderId'], function(error,result){
		if (error) {
            console.log('Order could not be retrieved for making payment, the order id was -- '+ req.params['orderId']);
        }else{
			console.log("The order returned for making payment is -- " + JSON.stringify(result));
			if (result != undefined && result.data != null) {
				console.log("about to retrieve user of the order before making payment -- "+req.params['orderId']);
				userModel.getByAttribute("id","com.bulkwise.User::"+result.data[0].Bulkwize.customer_id,function(error,userResult){
					if (error) {
						console.log('User could not be retrieved for making payment, the order id was -- '+ req.params['orderId']);
					}else{
						console.log("The user returned for making payment is -- " + JSON.stringify(userResult));
						
						// set content-type header and data as json in args parameter 
						var args = {
							data: { 
									purpose:result.data[0].Bulkwize.orderId,
									amount:result.data[0].Bulkwize.totalOrderAmount,
									buyer_name: userResult.data[0].firstName,
									email: userResult.data[0].email,
									phone: userResult.data[0].mobileNumber,
									send_email:"False",
									send_sms:"True",
									redirect_url:"http%3A%2F%2Fwww.bulkwize.com%2Forder%2F",
									webhook:"http%3A%2F%2Fwww.bulkwize.com%2Fpayment%2Fpaymentwebhook%2F",
									allow_repeated_payment:"False"
									
							},
							headers: { "Content-Type": "application/json","api_key": "f5530c93dc2b257e9f6d38159aac2603", "auth_token":"9a2c3d05a396d68a63c809ae47243906" }
						};
						
						pmntClient.post("https://www.instamojo.com/api/1.1/payment-requests/", args, function (data, response) {
							// parsed response body as js object 
							console.log("Response data from create payment request is " + JSON.stringify(data));
							// raw response 
							//console.log(response);
							res.send({"message":"success","data":data.payment_request.longurl});
						});

					}
				});
				
			}
		}
	});
    
});


/**
 * delete products from payment
 */
payment.delete('/product', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);

    var queryData = {key: '', value: ''};

    populateKeyValue(req,data,queryData);

    paymentModel.getByAttribute(queryData['key'], queryData['value'], function (error, result) {
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
				data.workflowState = "ProductRemoved";

            }
        }

        //saving final data
		if(data.length > 0){
			saveCart(data, res);
		}else{
			deleteCart(data,res);
		}

    });


});


/**
 * delete products from payment
 */
payment.delete('/variants', function (req, res, next) {


    var data = req.body;


    populateSessionDetails(req, data);

    var queryData = {key: '', value: ''};

    populateKeyValue(req,data,queryData);

    paymentModel.getByAttribute(queryData['key'], queryData['value'], function (error, result) {
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
    paymentModel.save(data, function (error, result) {
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
    paymentModel.delete(data.id, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
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
module.exports = payment;



