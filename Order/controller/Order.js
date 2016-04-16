/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages
var express = require('express');
var order = express.Router();
var orderModel = require('../model/OrderModel.js');
var _ = require('underscore');
var uuid = require('uuid');
var moment = require('moment');
var request = require('request');
var config = require('../config/invoice-config.json');
var smsConfig = require('../config/sms-config.json');
var Invoice = require('Invoice-ext');
var fs = require('fs');
var http = require("http");
var utilities = require('utilities/controller/Utilities.js');
var moment = require('moment');
/**
 * post order
 */
order.post('/create', function (req, res, next) {
    console.log("Create order for user with id - " + req.user.user);
    orderModel.createOrder(req.user.user, function (error, result) {
        if (error) {
            return res.status(400).send(error);
        }
		utilities.sendEmail('info@bulkwize.com',"Order is Requested - " +moment(new Date()).utcOffset("+05:30").format(),JSON.stringify(req.body),"None",function(error, result){
				if(error) {
					console.log("Could not send self email for order creation.");
				}
        res.send(result);
        // send order sms to end consumer
       /* var smsOptions = smsConfig.smsOptions;
        console.log("Printing order object before sending SMS " + JSON.stringify(result));
        smsOptions.path=smsOptions.path+result.data.customer_id+"&Msg=Your%20order%20number%20with%20Bulkwize&is%20"+result.data.id;
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

        req.end();*/
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
 * get order for a given order id
 */
order.get('/orderid/:orderNo', function (req, res, next) {
    console.log("Get order for order id  - " + req.params['orderNo']);
    orderModel.getAllOrders("id",req.params['orderNo'], function (error, result) {
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
    var _dirname = process.cwd()
    orderModel.getAllOrders("id",req.params['orderNo'], function (error, result) {

        if (error) {
            return res.status(400).send(error);
        }else{
            pdtItems = [],subtot = 0;
            var invoiceNumber =uuid.v4().substring(1,5) +"-"+ moment(new Date()).utcOffset("+05:30").format('DDMMYYYY');//TODO should be auto generated
            _.extend(result.data[0].Bulkwize, {'bulkwize-address': config.bulkwizeAddress});
            result.data[0].Bulkwize.products.forEach(function(obj,i){
                obj.productVariants.forEach(function (variant,i)
                {
                    amt=variant.productMRPUnit*variant.productOrderedQty*variant.productCountInCase*(variant.productDiscountPercentage/100);
                    pdtItems.push({
                        description: variant.productMaterialDescription,
                        quantity:variant.productOrderedQty,
                        rate: variant.productMRPUnit,
                        amount: amt,
                        vat:variant.productVATPercentage,
                        countInCase:variant.productCountInCase,
                        discount:variant.productDiscountPercentage
                    });
                    subtot +=parseInt(amt);
                });
            });

            orderDate = new Date(result.data[0].Bulkwize.updatedAt);
            invoiceDate = new Date()
            input = {
                currencyFormat: "₹%d",
                invoice_number: invoiceNumber,
                order_number:result.data[0].Bulkwize.id, //TODO check with Ashish tomorrow.
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
            var fileStream = fs.createWriteStream(__dirname+invoiceNumber+'-invoice.pdf');
            invoice.generatePDFStream(input).pipe(fileStream).on('finish', function () {  // finished
                if(!result.data[0].Bulkwize.invoice){
                    _.extend(result.data[0].Bulkwize,{'invoice':[{'invoiceNumber':invoiceNumber+'-invoice.pdf'}]});
                }else{
                    result.data[0].Bulkwize.invoice.push({'invoiceNumber':invoiceNumber+'-invoice.pdf'});
                }
                //res.send(result);
                orderModel.updateOrder(result.data[0].Bulkwize.id,result.data[0].Bulkwize, function (error, result) {

                    if (error) {
                        return res.status(400).send(error);
                    } else {
                        fs.readFile(__dirname+invoiceNumber+'-invoice.pdf', function(error, content) {
                            if (error) {
                                res.writeHead(500);
                                res.end();
                            }
                            else {

                                res.writeHead(200, { 'Content-Type': 'application/pdf',  'Content-Disposition': 'inline; filename='+invoiceNumber+'-invoice.pdf'});
                                res.end(content, 'utf-8');
                            }
                        });

                    }
                });
            });

            console.log('Invoice end');
        }



    });
});


/**
 * get invoice for order number
 */
order.get('/:orderNo/invoice/:variantId/variants', function (req, res, next) {
    console.log("Get invoice for orderId  - " + req.params['orderNo']);
    var _dirname = process.cwd()+"/"
    var variantId = req.params['variantId']
    orderModel.getAllOrders("id",req.params['orderNo'], function (error, result) {

        if (error) {
            return res.status(400).send(error);
        }else{
            pdtItems = [],subtot = 0;
            var invoiceNumber = uuid.v4().substring(1,5) +"-"+ moment(new Date()).utcOffset("+05:30").format('DDMMYYYY');//TODO should be auto generated
            _.extend(result.data[0].Bulkwize, {'bulkwize-address': config.bulkwizeAddress});
            result.data[0].Bulkwize.products.forEach(function(obj,i){
                obj.productVariants.forEach(function (variant,i)
                {
                    if(variant.sku_id == variantId) {
                        amt=variant.productMRPUnit*variant.productOrderedQty*variant.productCountInCase*(variant.productDiscountPercentage/100);
                        pdtItems.push({
                            description: variant.productMaterialDescription,
                            quantity: variant.productOrderedQty,
                            rate: variant.productMRPUnit,
                            amount: amt,
                            vat: variant.productVATPercentage,
                            countInCase: variant.productCountInCase,
                            discount:variant.productDiscountPercentage
                        });
                        subtot += parseInt(amt);
                    }
                });
            });

            orderDate = new Date(result.data[0].Bulkwize.updatedAt);
            invoiceDate = new Date()
            input = {
                currencyFormat: "₹%d",
                invoice_number: invoiceNumber,
                order_number:result.data[0].Bulkwize.id, //TODO check with Ashish tomorrow.
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
            var fileStream = fs.createWriteStream(__dirname+invoiceNumber+'-invoice.pdf');
            invoice.generatePDFStream(input).pipe(fileStream).on('finish', function () {  // finished
                if(!result.data[0].Bulkwize.invoice){
                    _.extend(result.data[0].Bulkwize,{'invoice':[{'invoiceNumber':invoiceNumber+'-invoice.pdf'}]});
                }else{
                    result.data[0].Bulkwize.invoice.push({'invoiceNumber':invoiceNumber+'-invoice.pdf'});
                }

                //res.send(result);

                orderModel.updateOrder(result.data[0].Bulkwize.id,result.data[0].Bulkwize, function (error, result) {

                    if (error) {
                        return res.status(400).send(error);
                    } else {
                        fs.readFile(__dirname+invoiceNumber+'-invoice.pdf', function(error, content) {
                            if (error) {
                                res.writeHead(500);
                                res.end();
                            }
                            else {

                                res.writeHead(200, { 'Content-Type': 'application/pdf',  'Content-Disposition': 'inline; filename='+invoiceNumber+'-invoice.pdf'});
                                res.end(content, 'utf-8');
                            }
                        });

                    }
                });

            });

            console.log('Invoice end');
        }



    });
});


// export product module
module.exports = order;



