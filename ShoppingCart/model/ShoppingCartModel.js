/**
 * Created by Devaraj on 11/02/2016.
 */



//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;



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
        products:[data.products],
        coupon_code:data.coupon_code,
        billing_address:data.billing_address,
        shipping_address:data.shipping_address,
        total_cart_value_after_discount:data.total_cart_value_after_discount,
                //Workflow states:{"created:""},
        createdAt : new Date(),
        updatedAt : new Date()
    }
    var documentId = data.document_id ? data.document_id : uuid.v4();

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

//exporting product model
module.exports = ShoppingCartModel;