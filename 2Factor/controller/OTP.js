/**
 * Created by Devaraj on 20/04/2016.
 */

//importing packages
var express = require('express');
var request = require('request');
var sms2factor = express.Router();
var config = require('../config/sms-config.json');
/**
 * Send OTP
 */
sms2factor.post('/sendOTP', function(req, res, next) {

    var url = "https://"+config.smsConfig.hostname+"/"+config.smsConfig.path+"/"+config.smsConfig.token+"/SMS/";

    request.get({ url: url+req.params['phonenumber']+"/AUTOGEN" },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                req.session.otpid = response.Details;
                res.send({message: 'success'})
            }
        });


});



/**
 * Send OTP
 */
sms2factor.get('/verifyOTP', function(req, res, next) {

    var otpId = req.session.otpid
    var url = "https://"+config.smsConfig.hostname+"/"+config.smsConfig.path+"/"+config.smsConfig.token+"/SMS/";

    request.get({ url: url+"VERIFY/"+otpId+"/"+req.params['otp']},
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send({message: 'success'})
            }
        });


});
