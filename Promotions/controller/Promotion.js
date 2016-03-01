/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var promotion = express.Router();
var promotionModel = require('../model/PromotionModel.js');
var fs = require('fs');


/**
 * Get All promotions
 */
promotion.get('/', function(req, res, next) {


    promotionModel.getAll('type','com.bulkwize.Promotion', function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Get All promotions
 */
promotion.get('/carousel', function(req, res, next) {
	console.log("inside carousel function ")
	var carouselUrlsJson = {"carouselURLs":[]}
	var files = fs.readdirSync(__dirname+"/../../appcontent/images/promotions/carousel");
	
	for(var i in files){
		console.log("file name is " + files[i])
		carouselUrlsJson.carouselURLs.push("/appcontent/images/promotions/carousel/"+files[i]);
	}
    res.send(carouselUrlsJson);
});

/**
 * Create promotion
 */
promotion.post('/', function(req, res, next) {


    promotionModel.save(req.body, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});



// export promotion module
module.exports = promotion;
