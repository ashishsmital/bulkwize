/**
 * Created by Devaraj on 06/02/2016.
 */

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
function CategoryModel() { };


/**
 * CategoryModel save method
 *
 * @param data
 *          Category json
 * @param callback
 *          callback for http response
 */
CategoryModel.save = function(data, callback) {

    var jsonObject = {
        type: "com.bulkwize.category",
        id:data.id,
        category_name:data.category_name,
        category_image_url:data.category_image_url,
        category_icon_url:data.category_icon_url,
        maximum_discount_percentage:data.maximum_discount_percentage,
        parent_category_id:data.parent_category_id

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
 * CategoryModel get All method
 *
 * @param data
 *          Category json
 * @param callback
 *          callback for http response
 */
CategoryModel.getAll = function(attribute,value,callback) {

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
 * CategoryModel get All method
 *
 * @param data
 *          Category json
 * @param callback
 *          callback for http response
 */
CategoryModel.getAllById = function(attribute,value,callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"="+value);

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
 * Get all brands of given category ids
 *
 * @param data
 *          array of category ids
 * @param callback
 *          callback for http response
 */
CategoryModel.getBrandsByCategoryIds = function(categoryIdArray,callback) {
	console.log("category id array inside the model object for querying brand is -- " + categoryIdArray);
    var query = N1qlQuery.fromString("select * from "+db._name+" as brand UNNEST brand.productCategoryId where productCategoryId IN ["+ categoryIdArray+"] GROUP BY brand.productBrandName");
	console.log("Executing the query -- " + query);
	//e.g. select * from default as brand UNNEST brand.productCategoryId where productCategoryId IN [3,16] GROUP BY brand.productBrandName;
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


// export product module
module.exports = CategoryModel;