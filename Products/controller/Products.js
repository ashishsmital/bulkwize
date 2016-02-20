/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var products = express.Router();
var ProductModel = require('../model/ProductModel.js');


/**
 * Save Product
 */
products.post('/', function(req, res, next) {


    ProductModel.save(req.body, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Get all Products
 */
products.get('/', function(req, res, next) {


    ProductModel.getByAttribute('type', 'com.bulkwise.Products', function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Get Products by Brand Name
 */
products.get('/brand/:brand_name', function(req, res, next) {


    ProductModel.getByAttribute('brand_name',req.params['brand_name'], function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});


/**
 * Get Products by Brand Name
 */
products.get('/brand/:brand_name', function(req, res, next) {


    ProductModel.getByAttribute('brand_name',req.params['brand_name'], function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Get Products by Category
 */
products.get('/category/:category', function(req, res, next) {


    ProductModel.getByAttributeArray("category_id",req.params['category'], function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Get distinct Brand from Product
 */
products.get('/uniquebrands', function(req, res, next) {


    ProductModel.getUniqueAttributes("brand_name", function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Get Brands for a given subcategory id
 */
products.post('/search', function(req, res, next) {
	console.log("category ids for product search are " + req.body.categoryIds);
	console.log("Brand name for product search are " + req.body.productBrandName);
	ProductModel.getProductsByCategoryIdsAndBrandName(req.body.categoryIds,req.body.productBrandName, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

// export product module
module.exports = products;


