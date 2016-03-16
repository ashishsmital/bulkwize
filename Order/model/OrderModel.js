/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;



/**
 * OrderModel class
 *
 * @constructor
 */
function OrderModel() { };

/**
 * Product save method
 *
 * @param data
 *          product json
 * @param callback
 *          callback for http response
 */
OrderModel.save = function(userId, callback) {

	var orderId = uuid.v4();
	console.log("the order id for new order is " + orderId);
	
    OrderModel.getShoppingCartById("id","com.bulkwise.Cart::"+userId, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
		console.log("retrieved the shopping cart for user id --" + userId + ". The order is " + result.data[0].default);
		result.data[0].default.type="com.bulkwise.Order";
		db.insert(orderId, result.data[0].default, function(error, result) {
			if(error) {
				callback(error, null);
				return;
			}
			callback(null, {message: 'success', data: result});
		});
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
OrderModel.get = function(key, callback) {


    db.get(key, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: [{'Bulkwize':result.value}]});
        return;
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
OrderModel.getByAttribute = function(attribute,value, callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"='"+value+"' and type='com.bulkwise.Order'");

    db.query(query, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
		console.log("The result of query in order model is -- " + JSON.stringify(result));
        callback(null, {message: 'success', data: result});
        return;
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
OrderModel.getShoppingCartById = function(attribute,value, callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"='"+value+"'");

    db.query(query, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
		console.log("The result of query in order model is -- " + JSON.stringify(result));
        callback(null, {message: 'success', data: result});
        return;
    });
}

//exporting product model
module.exports = OrderModel;