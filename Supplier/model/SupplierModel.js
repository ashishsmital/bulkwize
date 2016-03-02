/**
 * Created by Devaraj on 06/02/2016.
 */

//importing packages/modules
var uuid = require('uuid');
var db = require('dbutil').bucket;
var ViewQuery = require('dbutil').ViewQuery;
var N1qlQuery = require('dbutil').N1qlQuery;

/**
 * SupplierModel class
 *
 * @constructor
 */
function SupplierModel() { };


/**
 * SupplierModel save method
 *
 * @param data
 *          supplier json
 * @param callback
 *          callback for http response
 */
SupplierModel.save = function(data, callback) {

	var supplierJsonObject ={
		"id":0,
		"type" : "com.bulkwize.Supplier",
		"supplier_firstname" : data.supplierFirstName,
		"supplier_lastname" : data.supplierLastName,
		"supplier_business name" : data.supplierBusinessName,
		"supplier_list of holidays":data.supplierListOfholidays,
		"supplier_lead_time_to_deliver_in_working_days" : data.supplierLeadTimeToDeliver, 
		"supplier_taxes_in_percentage":{"vat":data.vat, "sales_tax":data.salesTax},
		"supplier_business address": data.supplierBusinessAddress,
		"supplier_warehouse-details":{
			"supplier_warehouse address":data.supplierWareHouseDetails,
			"supplier_warehouse_timings":data.supplierWareHouseTimings,
			"supplier_warehouse_contact_details":data.supplierWareHouseContactDetails
		},
		"supplier_contact_details":data.supplierContactDetails
	}



    db.counter("supplierCounter",1, function(err, res) {
		  		  if (err) {
		  			  console.log('Unable to fetch supplier counter & hence can not create dummy supplier', err);
					  return;
		  		  }

		  		  console.log('Creating a supplier with id...', res.value);
				  supplierJsonObject.id=res.value;
				  // create dummy supplier
							db.insert('suppl::'+res.value, supplierJsonObject , function(err, result) {
								  if (err) {
									console.log('supplierCounter creation failed', err);
									return;
								  }

								  console.log('supplierCounter creation was a success!', result);
								  callback(null, {message: 'success', data: result});
								});
					
		  		});		

 }

/**
 * SupplierModel get All method
 *
 * @param data
 *          supplier json
 * @param callback
 *          callback for http response
 */
SupplierModel.getAll = function(attribute,value,callback) {

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
 * SupplierModel get All method
 *
 * @param data
 *          supplier json
 * @param callback
 *          callback for http response
 */
SupplierModel.getAllById = function(attribute,value,callback) {

    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"="+value +"and type='com.bulkwize.Supplier'");

    db.query(query, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, {message: 'success', data: result});
        return;
    });
}




// export product module
module.exports = SupplierModel;