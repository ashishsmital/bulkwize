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
    orderModel.createOrder(req.user.user, function (error, orderResult) {
        if (error) {
            return res.status(400).send(error);
        }
		utilities.sendEmail('info@bulkwize.com',"Order placed - " +moment(new Date()).utcOffset("+05:30").format(),JSON.stringify(orderResult.data),"None",function(error, sendEmailResult){
				if(error) {
					console.log("Could not send self email for order creation.");
				}
        
        // send order sms to end consumer
		  utilities.sendSMS(req.user.user,"Thanks for placing your order with Bulkwize, your order id is " + orderResult.data.id, function(error,result){
				if(error) {
						console.log("There was an error sending SMS to supplier and the error message was " + result.data);
					}
				if(result.data.Status != undefined && result.data.Status != null && result.data.Status=='Error'){
					console.log("There was an error sending SMS to supplier and the error message was " + result.data);
				}
					console.log("SMS was successfully sent to supplier " + result.data);
			});
        // end of send SMS

    });
	
	res.send(orderResult);
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
    var deliveryCharge=0;
    var _dirname = process.cwd()
    orderModel.getAllOrders("id",req.params['orderNo'], function (error, result) {

        if (error) {
            return res.status(400).send(error);
        }else{
            pdtItems = [],subtot = 0;
            var invoiceNumber =uuid.v4().substring(1,5) +"-"+ moment(new Date()).utcOffset("+05:30").format('DDMMYYYY');//TODO should be auto generated
            _.extend(result.data[0].Bulkwize, {'bulkwize-address': config.bulkwizeAddress});
            result.data[0].Bulkwize.products.forEach(function(obj,i){
                obj.variants.forEach(function (variant,i)
                {
                   // amt=variant.productMRPUnit*variant.productOrderedQty*variant.productCountInCase*(variant.productDiscountPercentage/100);
                    amt=variant.productMRPUnit*variant.quantity*variant.productCountInCase*(variant.productDiscountPercentage/100);
                    pdtItems.push({
                        description: variant.productMaterialDescription,
                       // quantity:variant.productOrderedQty,
                        quantity:variant.quantity,
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

            var balance  = 0;
            //delivery charges

            if(result.data[0].Bulkwize.deliveryCharge){
                deliveryCharge=result.data[0].Bulkwize.deliveryCharge;
                balance = subtot+ deliveryCharge;
            }else{
                 console.log('In else part')
                 balance = subtot;
            }


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
                delivery_charges:deliveryCharge,
                tax:0,
                shipping:0,
                paid:0,
                balance:balance,

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
                obj.variants.forEach(function (variant,i)
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



