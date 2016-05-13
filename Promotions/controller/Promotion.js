/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var promotion = express.Router();
var promotionModel = require('../model/PromotionModel.js');
var fs = require('fs');
var gcm = require('node-gcm');

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
	var files = fs.readdirSync(__dirname+"/../../../../appcontent/images/promotions/carousel");
	
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

promotion.post('/register', function(req, res){
    deviceToken = req.body.deviceToken;
    console.log('device token received');
    console.log(deviceToken);
    promotionModel.saveToken(req.body, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.status(200).json({message:"Device Token registered successfully"});
    });
    
});

promotion.post('/push', function(req, res){

    var device_tokens = []; //create array for storing device tokens
    var retry_times = 1; //the number of times to retry sending the message if it fails

    var sender = new gcm.Sender('AIzaSyCU3t-cokL5WZRZ9ym6-wpOsKFlGbZBzTM'); //create a new sender
    var message = new gcm.Message(); //create a new message

    message.addData('title', req.body.promotionTitle);
    message.addData('message', req.body.promotionMessage);
    //message.addData('sound', 'notification');

    message.collapseKey = 'testing'; //grouping messages
    message.delayWhileIdle = false; //delay sending while receiving device is offline
    message.timeToLive = 3000; //the number of seconds to keep the message on the server if the device is offline

    /*
     code for fetching device_token from the database
    */
	promotionModel.getAllToken("type","com.bulkwize.deviceToken",function (error, result) {
        if (error) {
            return res.status(400).send(error);
        } else {
			if (result != null && !_.isUndefined(result) && result.data.length > 0) {
				console.log('Device tokens found' );
                
				// iterate over device token and add it to array
                _.each(result.data[0].Bulkwize, function (ele) {
					console.log("The device token while iterating is " + ele.deviceToken);
					device_tokens.push(ele.deviceToken);
				});
			}
		}
	});
	
    //device_tokens = req.body.promotionDeviceTokens;

    sender.send(message, device_tokens, retry_times, function(result){
        console.log(result);
        console.log('push sent to: ' + device_token);
    });

    res.status(200).json({message:"Notification sent successfully"});
});



// export promotion module
module.exports = promotion;
