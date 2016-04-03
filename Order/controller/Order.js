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
var Invoice = require('invoice-ninja');
var fs = require('fs');
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
            pdtItems = [],subtot = 0;
            var invoiceNumber = 1421;//TODO should be auto generated
            _.extend(result.data[0].Bulkwize, {'bulkwize-address': config.bulkwizeAddress});
            result.data[0].Bulkwize.products.forEach(function(obj,i){
              obj.variants.forEach(function (variant,i)
                {

                    pdtItems.push({
                        description: obj.productBrandName+"-"+obj.productDescription,
                        quantity:variant.quantity,
                        rate: variant.productUnitSizeWeightQty, //TODO check with Ashish and change
                        amount: variant.productMRPUnit //TODO check with Ashish and change
                    });
                    subtot +=parseInt(variant.productMRPUnit);
                });
            });

            today = new Date();
            due = new Date()
            due.setDate(today.getDate() + 14);

            input = {
                currencyFormat: "₹%d",
                invoice_number: invoiceNumber,
                date_now: today.toDateString(),
                date_due: due.toDateString(),
                from_name: 'Bulkwise',
                client_name: result.data[0].Bulkwize.shipping_address.address1,
                items: pdtItems,
                subtotal:subtot,
                tax:0,
                shipping:0,
                paid:0,
                balance:subtot,

            };

            var invoice = new Invoice();
            //invoice.generatePDFStream(input).pipe(fs.createWriteStream(invoiceNumber+'-invoice.pdf'));
          //  res.writeHead(200, {"Content-Type": "application/pdf"});
            invoice.generatePDFStream(input).pipe(fs.createWriteStream(invoiceNumber+'-invoice.pdf'));

        }

        res.send(result);

    });
});


// export product module
module.exports = order;



