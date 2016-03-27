/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var utilities = express.Router();
var utilitiesModel = require('../model/UtilitiesModel.js');
var nodemailer = require('nodemailer');


/**
 * Get All utilitiess
 */
utilities.get('/', function(req, res, next) {


    utilitiesModel.getAll('type','com.bulkwize.utilities', function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });

});

/**
 * Create utilities
 */
utilities.post('/sendmail', function(req, res, next) {


    // create reusable transporter object using the default SMTP transport
	var senderEmail = 'info%40bulkwize.com';
	if(req.body.senderEmail != undefined && req.body.senderEmail != null ){
		var senderEmail = req.body.senderEmail;
	}
	console.log("Before creating transporter the sender email is -- " + senderEmail);
	var transporter = nodemailer.createTransport("SMTP", {
		service: "Gmail",
        auth: {
            user: "info@bulkwize.com",
            pass: "*****"
        }
	});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: senderEmail, // sender address
    to: req.body.toEmail, // list of receivers
    subject: req.body.emailSubject, // Subject line
    text: req.body.emailTxt // plaintext body
    //html: '<b>Hello world </b>'  html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
});



// export product module
module.exports = utilities;
