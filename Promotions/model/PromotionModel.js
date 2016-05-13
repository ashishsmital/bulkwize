/**
 * Created by Devaraj on 06/02/2016.
 */

//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;
var moment = require('moment');

/**
 * PromotionModel class
 *
 * @constructor
 */
function PromotionModel() { };



/**
 * PromotionModel get All method
 *
 * @param data
 *          supplier json
 * @param callback
 *          callback for http response
 */
PromotionModel.getAll = function(attribute,value,callback) {

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

/**
 * PromotionModel save token for the android device
 *
 * @param data
 *          device token json
 * @param callback
 *          callback for http response
 */
PromotionModel.saveToken = function(data, callback) {

    var jsonObject = {
        type: "com.bulkwize.deviceToken",
        id:"com.bulkwize.deviceToken::"+data.deviceToken,
		deviceToken:data.deviceToken,
        userId:"anonymous",
		createdAt : moment(new Date()).utcOffset("+05:30").format(),
        updatedAt : moment(new Date()).utcOffset("+05:30").format()
        

    }
    db.upsert(data.deviceToken, jsonObject, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: result});
    });
}


/**
 * PromotionModel get ALL token for the android device
 *
 * @param data
 *          device token json
 * @param callback
 *          callback for http response
 */
PromotionModel.getAllToken = function(attribute,value, callback) {

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


// export promotion module
module.exports = PromotionModel;