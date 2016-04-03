/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages
var express = require('express');
var order = express.Router();
var orderModel = require('../model/OrderModel.js');
var _ = require('underscore');
var request = require('request');
var config = require('../config/invoice-config.json');

/**
 * post order
 */
order.post('/create', function (req, res, next) {
	console.log("Create order for user with id - " + req.user.user);
    orderModel.createOrder(req.user.user, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        } 
        res.send(result);
    });
});

/**
 * get order
 */
order.get('/', function (req, res, next) {
	console.log("Get order for customer_id  - " + req.user.user);
    orderModel.getAllOrders("customer_id",req.user.user, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        } 
        res.send(result);
    });
});


/**
 * get invoice for order number
 */
order.get('/:orderNo/invoice', function (req, res, next) {
    console.log("Get invoice for orderId  - " + req.params['orderNo']);
    orderModel.getAllOrders("id",req.params['orderNo'], function (error, result) {
        if (error) {
            return res.status(400).send(error);
        }else{
            _.extend(result.data[0].Bulkwize, {'bulkwize-address': config.bulkwizeAddress});
        }
        res.send(result);
    });
});


// export product module
module.exports = order;



