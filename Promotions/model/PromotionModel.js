/**
 * Created by Devaraj on 06/02/2016.
 */

//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;

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


// export promotion module
module.exports = PromotionModel;