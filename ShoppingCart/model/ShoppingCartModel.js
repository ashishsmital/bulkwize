/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;
var moment = require('moment');


/**
 * ShoppingCartModel class
 *
 * @constructor
 */
function ShoppingCartModel() { };

/**
 * Product save method
 *
 * @param data
 *          product json
 * @param callback
 *          callback for http response
 */
ShoppingCartModel.save = function(data, callback) {

    var jsonObject = {

        type:data.type,
        id:data.id,
        customer_id:data.customer_id,
        business_id:data.business_id,
        shop_id:data.shop_id,
        session_id:data.session_id,
        products:data.products,
        coupon_code:data.coupon_code,
        billing_address:data.billing_address,
        shipping_address:data.shipping_address,
        total_cart_value_after_discount:data.total_cart_value_after_discount,
        workflowState:data.workflowState,
        createdAt : data.createdAt,
		override_lead_time_for_delivery_in_days : data.override_lead_time_for_delivery_in_days,
		supplier_business_name : data.supplier_business_name,
        updatedAt : moment(new Date()).utcOffset("+05:30").format(),
		meta:{"expiry": 345600} // setting shopping cart TTL to 4 days, after which the document will self destruct !
    }
    var documentId = data.id ? data.id : data.session_id;



    db.upsert(documentId, jsonObject, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        if(data.customer_id) {
            //delete session key data if customer_id is passed
            db.remove(data.session_id, function (error, removedResult) {
                if (error) {
                    console.log(error);
                    if(error.code ==13){
                        callback(null, {message: 'success', data: result});
                    }else {
                        callback(error, removedResult);
                    }
                    return;
                }
                callback(null, {message: 'success', data: result});

            });
        }else{
            callback(null, {message: 'success', data: result});
        }

    });
}
/**
 * Delete's details in shopping cart for the given key
 *
 * @param key
 * @param callback
 */
ShoppingCartModel.delete =function(key,callback){

    db.remove(key, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }

        callback(null, {message: 'success', data: result});
    });
};

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
ShoppingCartModel.get = function(key, callback) {


    db.get(key, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: [{'bulkwize':result.value}]});
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
ShoppingCartModel.getByAttribute = function(attribute,value, callback) {

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
 *
 * Get Un checked out cart for a given user
 *
 * @param attribute
 *         attribute name
 * @param value
 *          attribute value
 * @param callback
 *          http callback
 */
ShoppingCartModel.getUncheckedOutCart = function(customer_id, callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where type='com.bulkwise.Cart' and customer_id='"+value+"' and workflowState = 'updated' "); //or workflowState = 'ShippingAddressAdded'

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
ShoppingCartModel.getUserById = function(attribute,value, callback) {

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

//exporting product model
module.exports = ShoppingCartModel;