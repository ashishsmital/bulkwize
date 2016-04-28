var express = require('express');
var _ = require('underscore');
var user = express.Router();
var UserModel = require('../model/UserModel.js');
var utilities = require('utilities/controller/Utilities.js');
var request = require('request');
var moment = require('moment');

/**
 * Save User
 */
user.post('/', function (req, res, next) {

    var jsonObject = {
        mobileNumber: req.body.mobileNumber,
        shopName: req.body.shopName,
        firstName: req.body.firstname,
        password: req.body.password,
        lastName: req.body.lastname,
        pan: req.body.pan,
        email: req.body.email,
		vatLicense:req.body.vatLicense,
		stptLicense:req.body.stptLicense,
		selLicense:req.body.selLicense,
		tradeLicense:req.body.tradeLicense,
		hawkerLicense:req.body.hawkerLicense,
        shopAddress: req.body.shopAddress,
        deliveryAddress: req.body.deliveryAddress,
		type:"com.bulkwise.User",
		id: req.body.mobileNumber,
		createdDate:moment(new Date()).utcOffset("+05:30").format()
    }
    var key;
    console.log('Creating user');
    if (jsonObject.mobileNumber.indexOf('bulkwise') > -1) {
        key = jsonObject.mobileNumber;
    } else {

        key = 'com.bulkwise.User::' + jsonObject.mobileNumber;
    }
	jsonObject.id=key;
    UserModel.getByAttribute("id", key, function (error, result) {


        if (result != null && !_.isUndefined(result) && result.data.length > 0) {

            return res.status(400).send({"errorMessage": "User already exists"});
        } else {
            UserModel.save(jsonObject, function (error, result) {
                if (error) {
                    return res.status(400).send(error);
                }
                console.log('User Created');
				utilities.sendEmail('info@bulkwize.com',"User Mobile Number - " + req.body.mobileNumber + "User registered on - " +moment(new Date()).utcOffset("+05:30").format(),JSON.stringify(req.body),"None",function(error, result){
				    if(error) {
					    console.log("Could not send Email for user Registration.");
				}
				console.log('User Details Are :-');
				console.log('Shop Name :-' + jsonObject.shopName);
				console.log('First Name :-' + jsonObject.firstName);
				console.log('Last Name :-' + jsonObject.lastName);
				console.log('Password :-' + jsonObject.password);
				console.log('PAN :-' + jsonObject.pan);
				console.log('E-mail :-' + jsonObject.email);
				console.log('Vat License :-' + jsonObject.vatLicense);
				console.log('Service/Professional License :-' + jsonObject.stptLicense);
				console.log('Shops & Establishment License :-' + jsonObject.selLicense);
				console.log('Trade License :-' + jsonObject.tradeLicense);
				console.log('Shop Address :-' + jsonObject.shopAddress);
				console.log('Delivery Address :-' + jsonObject.deliveryAddress);
		    });
				utilities.sendSMS(req.body.mobileNumber,"Thanks for registering at Bulkwize, Your user name is " + req.body.mobileNumber + "and password is" + req.body.password + ". Happy to serve you. - Bulkwize", function(error,result){
					if(error) {
							console.log("There was an error while sending sms for registration success message" + result.data);
						}
					if(result.data.Status != undefined && result.data.Status != null && result.data.Status=='Error'){
						console.log("There was an error while sending sms for registration success message" + result.data);
					}
						console.log("SMS was successfully sent for registration" + result.data);
			});
                res.send(result);
            });
        }
    });
});

user.get('/', function (req, res, next) {
    var key;
    var mobileNumber = req.user.user;
    if (mobileNumber.indexOf('bulkwise') > -1) {
        key = mobileNumber;
    } else {

        key = 'com.bulkwise.User::' + mobileNumber;
    }
    UserModel.getByAttribute("id", key, function (error, result) {

        if (result) {
            res.send(result);
        } else {
            return res.status(404).send(error);
        }
    });

});

user.get('/:user', function (req, res, next) {
    var key;
    var mobileNumber = req.params['user'];
    if (mobileNumber.indexOf('bulkwise') > -1) {
        key = mobileNumber;
    } else {

        key = 'com.bulkwise.User::' + mobileNumber;
    }
    UserModel.getByAttribute("id", key, function (error, result) {

        if (result) {
            res.send(result);
        } else {
            return res.status(404).send(error);
        }
    });

});
// Check if there exists a user with the given mobile number
user.get('/checkMobileNumber/:mobileNumber', function (req, res, next) {
    var key;
    var mobileNumber = req.params['mobileNumber'];
    key = 'com.bulkwise.User::' + mobileNumber;
    
    UserModel.getByAttribute("id", key, function (error, result) {

        if (result) {
            res.send(result);
        } else {
            return res.status(404).send(error);
        }
    });

});

// Return user's details based on his mobile number
user.get('/forgotpassword/:mobileNumber', function (req, res, next) {
    var key;
    var mobileNumber = req.params['mobileNumber'];
    key = 'com.bulkwise.User::' + mobileNumber;
    
    UserModel.getByAttribute("id", key, function (error, result) {

        if (result) {
            res.send(result);
        } else {
            return res.status(404).send(error);
        }
    });

});

user.put('/', function (req, res, next) {
    var key;
    var mobileNumber = req.body.mobileNumber;
    key = 'com.bulkwise.User::' + mobileNumber;
    
    UserModel.getByAttribute("id", key, function (error, result) {

        if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                console.log('the user retrieved is ' + JSON.stringify(result.data));
				var retrivedUser = result.data[0].Bulkwize;
				retrivedUser.deliveryAddress = req.body.deliveryAddress;
				UserModel.save(retrivedUser, function (error, result) {
					if (error) {
						return res.status(400).send(error);
					}
					console.log('User updated as part of save user from my profile');
					res.send(result);
				});
		}   
	});		
});

// update password for the user
user.put('/forgotpassword/', function (req, res, next) {
    var key;
    var mobileNumber = req.body.mobileNumber;
    key = 'com.bulkwise.User::' + mobileNumber;
    
    UserModel.getByAttribute("id", key, function (error, result) {

        if (result != null && !_.isUndefined(result) && result.data.length > 0) {
                console.log('the user retrieved is ' + JSON.stringify(result.data));
                
                result.data[0].Bulkwize.password=req.body.password;
				console.log("Saving the user with updated password" + JSON.stringify(result.data[0].Bulkwize))
				UserModel.save(result.data[0].Bulkwize, function (error, result) {
					if (error) {
						return res.status(400).send(error);
					}
					console.log('User updated as part of forgot password');
					res.send(result);
				});
        } else {
            return res.status(404).send(error);
        }
    });
});

//exporting user
module.exports = user;