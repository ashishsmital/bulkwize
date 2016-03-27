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
		"supplier_firstname" : data.supplier_firstname,
		"supplier_lastname" : data.supplier_lastname,
		"supplier_business_name" : data.supplier_business_name,
		"supplier_manufacturer_name" : data.supplier_manufacturer_name,
		"supplier_list_of_holidays":data.supplier_list_of_holidays,
		"supplier_lead_time_to_deliver_in_working_days" : data.supplier_lead_time_to_deliver_in_working_days, 
		"supplier_taxes_in_percentage":{"vat":data.vat, "sales_tax":data.salesTax},
		"supplier_business_address": data.supplier_business_address,
		"supplier_warehouse_details":{
			"supplier_warehouse_address":data.supplier_warehouse_address,
			"supplier_warehouse_timings":data.supplier_warehouse_timings,
			"supplier_warehouse_contact_details":data.supplier_warehouse_contact_details
		},
		"supplier_contact_details":data.supplier_contact_details
	}


	SupplierModel.getByBusinessName("supplier_business_name",data.supplier_business_name, function(error,result){
		if(error){
			console.log("No supplier found byt the given business name, hence it needs to be added");
			db.counter("supplierCounter",1, function(err, res) {
		  		  if (err) {
		  			  console.log('Unable to fetch supplier counter & hence can not create dummy supplier', err);
					  return;
		  		  }

		  		  console.log('Creating a supplier with id...', res.value);
				  supplierJsonObject.id="com.bulkwize.Supplier::"+res.value;
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
		}else{
			console.log("Supplier found by the given business name, hence skipping adding this supplier");
		}
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

/**
 * SupplierModel get By Supplier business name
 *
 * @param data
 *          supplier json
 * @param callback
 *          callback for http response
 */
SupplierModel.getByBusinessName = function(attribute,value,callback) {
	console.log("Retrieving supplier by business name " + value);
    var query = N1qlQuery.fromString("select * from "+db._name+" where "+attribute+"="+value +"and type='com.bulkwize.Supplier'");

    db.query(query, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
		console.log("Supplier retrieved by business name " + value + " is -- " + JSON.stringify(result));
        callback(null, {message: 'success', data: result});
        return;
    });
}




// export product module
module.exports = SupplierModel;