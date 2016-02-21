/**
 * Created by Devaraj on 06/02/2016.
 */

//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;

/**
 * ProductModel class
 *
 * @constructor
 */
function ProductModel() { };

/**
 * Product save method
 *
 * @param data
 *          product json
 * @param callback
 *          callback for http response
 */
ProductModel.save = function(data, callback) {

    var jsonObject = {
        type: "com.bulkwise.Products",
        id: data.id,
        display_title: data.title,
        brand_name:data.brand_name,
        short_summary:data.short_summary,
        description:data.description,
        name:data.name,
        img_url:data.img_url,
        is_visible:data.is_visible,
        variants:data.variants,
        product_metafields:data.product_metafields,
        created_at:new Date(),
        udpated_at:new Date(),
        category_id:data.category_id,
        supplier_id:data.supplier_id,
        override_lead_time_for_delivery_in_days:20,
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
ProductModel.getByAttribute = function(attribute,value, callback) {

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
 * Get Attribute Array
 *
 * @param attribute
 *          attribute by name
 * @param value
 *          attribute by value
 * @param callback
 *          https callback
 */
ProductModel.getByAttributeArray = function(attribute,value, callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where ANY id in "+attribute+" SATISFIES id =='"+value+"' END");

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
 *
 *
 * @param attribute
 * @param value
 * @param callback
 */
ProductModel.getUniqueAttributes = function(attribute, callback) {

    var query = N1qlQuery.fromString("select distinct("+attribute+") from "+db._name);

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
module.exports = ProductModel;