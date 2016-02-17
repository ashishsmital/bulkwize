/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var category = express.Router();
var CategoryModel = require('../model/CategoryModel.js');


/**
 * Get Products by Brand Name
 */
category.get('/', function(req, res, next) {


    CategoryModel.getAll('type','com.bulkwize.category', function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Get Products by Brand Name
 */
category.post('/', function(req, res, next) {


    CategoryModel.save(req.body, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

// export product module
module.exports = category;