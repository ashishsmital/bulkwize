/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages
var express = require('express');
var order = express.Router();
var orderModel = require('../model/OrderModel.js');
var _ = require('underscore');
var request = require('request');

/**
 * post order
 */
order.post('/:userId', function (req, res, next) {
	console.log("Create order for user with id - " + req.params['userId']);
    orderModel.save(req.params['userId'], function (error, result) {
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
    orderModel.getByAttribute("customer_id",req.user.user, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        } 
        res.send(result);
    });
});

// export product module
module.exports = order;



