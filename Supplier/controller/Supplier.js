/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var supplier = express.Router();
var supplierModel = require('../model/SupplierModel.js');


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
        res.send(result);
    });

});



// export product module
module.exports = supplier;
