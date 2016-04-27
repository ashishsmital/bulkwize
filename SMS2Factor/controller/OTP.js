/**
 * Created by Devaraj on 20/04/2016.
 */

//importing packages
var express = require('express');
var request = require('request');
var sms2factor = express.Router();
var config = require('../config/sms-config.json');
var _ = require('underscore');

/**
 * Send OTP
 */
sms2factor.post('/sendOTP', function(req, res, next) {

    var url = "https://"+config.smsConfig.hostname+"/"+config.smsConfig.path+"/"+config.smsConfig.token+"/SMS/";console.log(req.body.phonenumber);
    var phNumber = req.body.phonenumber;
    if(phNumber) {
        url = url + phNumber + "/AUTOGEN";

        console.log(url+ " OTP sent to Phone Number "+phNumber);

        request.get({url: url},
            function (error, response) {
                if (!error && response.statusCode == 200) {
                    var obj = JSON.parse(response.body);
                    req.session.OTPSessionID = obj.Details;
                    console.log("OTP session ID "+req.session.OTPSessionID);

                    res.send({message: 'success'});
                }
            });
    }else{
        res.send({message: 'Error in sending OTP'});
    }


});



/**
 * Send OTP
 */
sms2factor.get('/verifyOTP/:otp', function(req, res, next) {

    var otpSessionID = req.session.OTPSessionID
    var userOTP =req.params['otp'];
    if(userOTP) {
        var url = "https://" + config.smsConfig.hostname + "/" + config.smsConfig.path + "/" + config.smsConfig.token + "/SMS/";
        url = url + "VERIFY/" + otpSessionID + "/" + userOTP;
        request.get({url: url},
            function (error, response) {
                if (!error && response.statusCode == 200) {
                    console.log("Response from 2factor "+response.body);
                    res.send({message: 'success'})
                }else{
                    console.log("Error Response from 2factor "+response.body);
                    res.send({message: 'Error validating OTP'})
                }
            });
    }else{
        res.send({message: 'Error validating OTP'})
    }

});



// export product module
module.exports = sms2factor;
