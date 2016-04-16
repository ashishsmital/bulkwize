/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var supplier = express.Router();
var supplierModel = require('../model/SupplierModel.js');
var utilities = require('utilities/controller/Utilities.js');
var moment = require('moment');


/**
 * Get All Suppliers
 */
supplier.get('/', function(req, res, next) {


    supplierModel.getAll('type','com.bulkwize.Supplier', function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Create supplier
 */
supplier.post('/', function(req, res, next) {


    supplierModel.save(req.body, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
		utilities.sendEmail('info@bulkwize.com',"Supplier registered on - " +moment(new Date()).utcOffset("+05:30").format(),JSON.stringify(req.body),"None",function(error, result){
				if(error) {
					console.log("Could not send self email for supplier registration.");
				}
				res.send(result); // return response to browser
		});
        
    });

});



// export product module
module.exports = supplier;
