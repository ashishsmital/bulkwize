/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;
var moment = require('moment');
var _ = require('underscore');



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
OrderModel.createOrder = function(userId, callback) {

	var orderId = userId +"-"+ uuid.v4().substring(1,5) +"-"+ moment(new Date()).utcOffset("+05:30").format('DDMMYYYY')	;
	console.log("the order id for new order is " + orderId);
	
    OrderModel.getShoppingCartById("id","com.bulkwise.Cart::"+userId, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
		console.log("retrieved the shopping cart for user id --" + userId + ". The order is " + result.data[0].Bulkwize);
		var orderObj = _.clone(result.data[0].Bulkwize);
		orderObj.type="com.bulkwise.Order";
		orderObj.id=orderId;
		orderObj.createdAt= moment(new Date()).utcOffset("+05:30").format();
		orderObj.updatedAt= moment(new Date()).utcOffset("+05:30").format();
		// calculate total order value
		var sum = 0;
				var totalOrderValue = 0;
				// calculate the total number of products in the cart
                _.each(orderObj.products, function (ele) {

                    sum += ele.variants.length;
					// calculate the total cart value
					_(ele.variants).each(function (eleV) {
						console.log("Inside variants loop");
						totalOrderValue += eleV.productCountInCase*eleV.quantity*eleV.productMRPUnit*(100-eleV.productDiscountPercentage)/100;

					});
				
                });
                _.extend(orderObj, {'totalCount': sum});
				_.extend(orderObj, {'totalOrderValue': totalOrderValue});
		db.insert(orderId, orderObj, function(error, orderResult) {
			if(error) {
				callback(error, null);
				return;
			}
			result.data[0].Bulkwize.workflowState="ordercreated"; // marking the shopping cart as closed.
			_.extend(result.data[0].Bulkwize, {'orderId': orderId}); // updating shopping cart with order id
			OrderModel.closeShoppingCart(result.data[0].Bulkwize.id,result.data[0].Bulkwize,function(error,resultSaveShoppingCart){
				if(error) {
					callback(error, null);
					return;
				}
				callback(null, {message: 'success', data: orderObj});
			});
			
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
OrderModel.getAllOrders = function(attribute,value, callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"='"+value+"' and type='com.bulkwise.Order' order by createdAt DESC");

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
OrderModel.closeShoppingCart = function(documentId,jsonObject, callback) {
	console.log("Closing shopping cart for cart id -- " + documentId + " and the cart value being updated is " + JSON.stringify(jsonObject));
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
 * Update Order
 *
 * @param attribute
 *         attribute name
 * @param value
 *          attribute value
 * @param callback
 *          http callback
 */
OrderModel.updateOrder = function(documentId, orderObj, callback) {

     db.upsert(documentId, orderObj, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
       console.log("The order was successfully saved -- " + JSON.stringify(result));
       callback(null, {message: 'success', data: result});


    });

    
}

//exporting product model
module.exports = OrderModel;