/**
 * Created by harman on 08/02/2016.
 */

var db = require('./index.js').bucket;
var dummySuppliers = require('./conf/dummy-supplier.json');

var productCounter = 0; // this is only for first time, else retrieve this value from the counter below.
var categoryCounter = 0; // this is only for first time, else retrieve this value from the counter below.
var supplierCounter = 0; // this is only for first time, else retrieve this value from the counter below.

// Products Counter check
	db.get("productCounter", function(err, res) {
		  		  if (err) {
		  			  console.log('Product Counter existince check failed with error... ', err);
					  console.log('Product Counter does not exist and hence creating it with initial value as ' + productCounter );
					  // create couchabse products counter if not already exists
							db.insert('productCounter', productCounter , function(err, res) {
								  if (err) {
									console.log('productCounter creation failed', err);
									return;
								  }

								  console.log('productCounter creation was a success!', res);
								});

		  		    return;
		  		  }

		  		  console.log('Product Counter already existis and hence need not create it', res);
		  		});

// Category Counter check
	db.get("categoryCounter", function(err, res) {
		  		  if (err) {
		  			  console.log('Category Counter existince check failed with error... ', err);
					  console.log('Category Counter does not exist and hence creating it with initial value as ' + categoryCounter );
					  // create couchabse category counter if not already exists
							db.insert('categoryCounter', categoryCounter , function(err, res) {
								  if (err) {
									console.log('categoryCounter creation failed', err);
									return;
								  }

								  console.log('categoryCounter creation was a success!', res);
								});

		  		    return;
		  		  }

		  		  console.log('Category Counter already existis and hence need not create it', res);
		  		});

// Supplier Counter check
	db.get("supplierCounter", function(err, res) {
		  		  if (err) {
		  			  console.log('Supplier Counter existince check failed with error... ', err);
					  console.log('Supplier Counter does not exist and hence creating it with initial value as ' + supplierCounter );
					  // create couchabse supplier counter if not already exists
							db.insert('supplierCounter', supplierCounter , function(err, res) {
								  if (err) {
									console.log('supplierCounter creation failed', err);
									return;
								  }

								  console.log('supplierCounter creation was a success!', res);
								});

		  		    return;
		  		  }

		  		  console.log('Supplier Counter already existis and hence need not create it', res);
		  		});
				
// Create dummy supplier
	db.counter("supplierCounter",1, function(err, res) {
		  		  if (err) {
		  			  console.log('Unable to fetch supplier counter & hence can not create dummy supplier', err);
					  return;
		  		  }

		  		  console.log('Creating a supplier with id...', res.value);
				  // create dummy supplier
							db.insert('suppl::'+res.value, dummySuppliers.suppliers[0] , function(err, res) {
								  if (err) {
									console.log('supplierCounter creation failed', err);
									return;
								  }

								  console.log('supplierCounter creation was a success!', res);
								});

		  		});				
				

