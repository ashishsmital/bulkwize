var express = require('express');
var _ = require('underscore');
var user = express.Router();
var UserModel = require('../model/UserModel.js');


/**
 * Save User
 */
user.post('/', function (req, res, next) {

    var jsonObject = {
        mobileNumber: req.body.mobileNumber,
        shopName: req.body.shopName,
        firstName: req.body.firstName,
        password: req.body.password,
        lastName: req.body.lastName,
        pan: req.body.pan,
        email: req.body.email,
        shopAddress: req.body.shopAddress,
        deliveryAddress: req.body.deliveryAddress,
		type:"com.bulkwise.User",
		id: req.body.mobileNumber
    }
    var key;

    if (jsonObject.mobileNumber.indexOf('bulkwise') > -1) {
        key = jsonObject.mobileNumber;
    } else {

        key = 'com.bulkwise.User::' + jsonObject.mobileNumber;
    }
	jsonObject.id=key;
    UserModel.getByAttribute("mobileNumber", key, function (error, result) {

        if (result != null && !_.isUndefined(result) && result.data.length > 0) {
            return res.status(400).send({"errorMessage": "User already exists"});
        } else {
            UserModel.save(jsonObject, function (error, result) {
                if (error) {
                    return res.status(400).send(error);
                }
                res.send(result);
            });
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
    UserModel.getByAttribute("mobileNumber", key, function (error, result) {

        if (result) {
            res.send(result);
        } else {
            return res.status(404).send(error);
        }
    });

});

//exporting user
module.exports = user;