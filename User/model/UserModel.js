
//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;
var moment = require('moment');

/**
 * CategoryModel class
 *
 * @constructor
 */
function UserModel() { };

/**
 * User save method
 *
 * @param data
 *          user json
 * @param callback
 *          callback for http response
 */
UserModel.save = function(data, callback) {

    var jsonObject = {
        mobileNumber:data.mobileNumber,
        shopName:data.shopName,
        firstName:data.firstName,
        password:data.password,
        lastName:data.lastName,
        pan:data.pan,
        email:data.email,
		vatLicense:data.vatLicense,
		stptLicense:data.stptLicense,
		selLicense:data.selLicense,
		tradeLicense:data.tradeLicense,
		hawkerLicense:data.hawkerLicense,
        shopAddress:data.shopAddress,
        deliveryAddress:data.deliveryAddress,
		type:"com.bulkwise.User",
		id:data.id,
		createdDate:moment(new Date()).utcOffset("+05:30").format()
    }

    var documentId = data.id+'';

    //documentId = 'com.bulkwise.User::' + jsonObject.mobileNumber;
    db.upsert(documentId, jsonObject, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: result});
    });
}

/**
 *
 * Get Attribute by Name
 *
 * @param attribute
 *         attribute name
 * @param value
 *          attribute value
 * @param callback
 *          http callback
 */
UserModel.getByAttribute = function(attribute,value, callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"='"+value+"' and type='com.bulkwise.User'");
    db.query(query, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: result});
        return;
    });
}

//exporting user model
module.exports = UserModel;