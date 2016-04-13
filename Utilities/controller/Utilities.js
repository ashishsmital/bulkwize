/**
 * Created by Devaraj on 05/02/2016.
 */


//importing packages
var express = require('express');
var utilities = express.Router();
var utilitiesModel = require('../model/UtilitiesModel.js');
var mailConfig = require('../config/mail-config.json');
var smtpTransport = require("nodemailer-smtp-transport");
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : mailConfig.mailConfig.smtpHost,
    secureConnection : false,
    port: mailConfig.mailConfig.smtpPort,
    auth : {
        user : mailConfig.mailConfig.smtpAuthUser,
        pass : mailConfig.mailConfig.smtpAuthPwd
    }
}));


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
 * Create utilities for sending email
 */
utilities.post('/sendmail', function(req, res, next) {


    // create reusable transporter object using the default SMTP transport
	var senderEmail = 'info%40bulkwize.com';
	if(req.body.senderEmail != undefined && req.body.senderEmail != null ){
		var senderEmail = req.body.senderEmail;
	}
	console.log("Before creating transporter the sender email is -- " + senderEmail);
	

// setup e-mail data with unicode symbols
var mailOptions = {
    from: senderEmail, // sender address
    to: req.body.toEmail, // list of receivers
    subject: req.body.emailSubject, // Subject line
    text: req.body.emailTxt // plaintext body
    //html: '<b>Hello world </b>'  html body
};

// send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
		return res.status(400).send(error);
    }
    console.log('Message sent: ' + info.response);
	return res.status(200).send({'status':'success', 'data':info.response});
});
});

utilities.sendEmail = function(toEmail,emailSubject,emailTxt,emailHTML,callback){
	console.log("Inside send email function -- " );
	// create reusable transporter object using the default SMTP transport
	var senderEmail = 'info%40bulkwize.com';
	console.log("Before creating transporter the sender email is -- " + senderEmail);
	

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: senderEmail, // sender address
		to: toEmail, // list of receivers
		subject: emailSubject, // Subject line
		text: emailTxt // plaintext body
		//html: emailHTML  html body
	};

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			callback(null, {'status':'error', 'data':error});
			return;
		}
		console.log('Message sent: ' + info.response);
		callback(null, {'status':'success', 'data':info.response});
		
	});
}


// export product module
module.exports = utilities;
