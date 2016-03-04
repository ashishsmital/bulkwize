
//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;

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
        shopAddress:data.shopAddress,
        deliveryAddress:data.deliveryAddress
    }
    var documentId;
    if (jsonObject.mobileNumber.indexOf('bulkwise') > -1) {
        documentId = jsonObject.mobileNumber;
    } else {

        documentId = 'com.bulkwise.User::' + jsonObject.mobileNumber;
    }
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

    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"='"+value+"'");
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