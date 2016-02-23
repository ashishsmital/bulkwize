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
 *
 * Getby Id
 *
 * @param attribute
 *         attribute name
 * @param value
 *          attribute value
 * @param callback
 *          http callback
 */
ProductModel.getById = function(productId, callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where id = '"+productId+"' and type='com.bulkwise.Products'");

    db.query(query, function(error, result) {
        if (error) {
			console.log("Error while retrieving product by product id --" + productId)
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


/**
 * Get all products for given category id and brand
 *
 * @param data
 *          array of category ids
 * @param callback
 *          callback for http response
 */
ProductModel.getProductsByCategoryIdsAndBrandName = function(categoryIdArray,productBrandName,callback) {
	console.log("category id array inside the model object for querying products is -- " + categoryIdArray);
	console.log("Brand name inside the model object for querying products is -- " + productBrandName);
    var query = N1qlQuery.fromString("select * from "+db._name+" as brand UNNEST brand.productCategoryId where productCategoryId IN ["+ categoryIdArray+"] and brand.productBrandName = '" + productBrandName+"'");
	console.log("Executing the query -- " + query);
	//e.g. select * from default as brand UNNEST brand.productCategoryId where productCategoryId IN [3,16] and brand.productBrandName = "Tide";
    db.query(query, function(error, result) {
        if (error) {
			console.log("Error in executing query ", error);
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: result});
        return;
    });
}

/**
 * Get all products for given category id and brand
 *
 * @param data
 *          array of category ids
 * @param callback
 *          callback for http response
 */
ProductModel.getProductsByLikeSearch = function(searchString,callback) {
	console.log("Inside product search for query string -- " + searchString);
	
    var query = N1qlQuery.fromString("select id, productName as ProductNameSearch from "+db._name+" where lower(productName) LIKE '%"+searchString+"%' and type='com.bulkwise.Products' UNION select distinct productCategoryId,productBrandName as ProductBrandNameSearch from "+db._name+" where lower(productBrandName) LIKE '%" +searchString+"%' and type='com.bulkwise.Products'");
	
	console.log("Executing the query -- " + query);
/* e.g. Query
select id, productName as ProductNameSearch from default where lower(productName) LIKE "%rie%" and type="com.bulkwise.Products"
UNION
select id, productShortSummary as ProductShortSummarySearch from default where lower(productShortSummary) LIKE "%rie%" and type="com.bulkwise.Products"
UNION
select id,productBrandName as ProductBrandNameSearch from default where lower(productBrandName) LIKE "%rie%" and type="com.bulkwise.Products"
UNION
select id,productDescription as ProductDescriptionSearch from default where lower(productDescription) LIKE "%rie%" and type="com.bulkwise.Products"
UNION
select id,productDisplayTitle as ProductTitleSearch from default where lower(productDisplayTitle) LIKE "%rie%" and type="com.bulkwise.Products";
*/
    db.query(query, function(error, result) {
        if (error) {
			console.log("Error in executing query ", error);
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: result});
        return;
    });
}






//exporting product model
module.exports = ProductModel;