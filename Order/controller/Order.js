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
var smsConfig = require('../config/sms-config.json');
var Invoice = require('Invoice-ext');
var fs = require('fs');
var http = require("http");
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
		 // send order sms to end consumer
		var smsOptions = smsConfig.smsOptions;
		smsOptions.path=smsOptions.path+req.user.user+"&Msg=Your%20order%20number%20with%20Bulkwize&is%20"+result.data[0].Bulkwize.id;
		console.log("SMS options is " + JSON.stringify(smsOptions));
		var req = http.request(smsOptions, function (res) {
		  var chunks = [];

		  res.on("data", function (chunk) {
			chunks.push(chunk);
		  });

		  res.on("end", function () {
			var body = Buffer.concat(chunks);
			console.log(body.toString());
		  });
		});

		req.end();
		// end of send SMS

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
              obj.productVariants.forEach(function (variant,i)
                {

                    amt=variant.productMRPUnit*variant.productOrderedQty*variant.productCountInCase;
                    pdtItems.push({
                        description: variant.productMaterialDescription,
                        quantity:variant.productOrderedQty,
                        rate: variant.productMRPUnit,
                        amount: amt,
                        vat:variant.productVATPercentage,
                        countInCase:variant.productCountInCase,
                    });
                    subtot +=parseInt(amt);
                });
            });

            orderDate = new Date(result.data[0].Bulkwize.updatedAt);
            invoiceDate = new Date()
            input = {
                currencyFormat: "₹%d",
                invoice_number: invoiceNumber,
                order_number:invoiceNumber, //TODO check with Ashish tomorrow.
                orderDate: orderDate.toISOString().
                replace(/T/, ' ').
                replace(/\..+/, ''),
                invoiceDate: invoiceDate.toISOString().
                replace(/T/, ' ').
                replace(/\..+/, ''),
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



