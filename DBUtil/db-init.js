/**
 * Created by harman on 08/02/2016.
 */

var db = require('./index.js').bucket;
var dummySuppliers = require('./conf/dummy-supplier.json');
var csv = require('fast-csv');
var fs = require('fs');

var productCounter = 0; // this is only for first time, else retrieve this value from the counter below.
var categoryCounter = 0; // this is only for first time, else retrieve this value from the counter below.
var supplierCounter = 0; // this is only for first time, else retrieve this value from the counter below.

var categoryObj = {
	 "type":"com.bulkwize.category",
	 "category_name":"Personal Care",
	 "cateory_img_url":"../images/category/personal_care.img",
	 "cateory_icon_url":"../icons/category/personal_care.img",
	 "maximum_discount_percentage":65, 
	 "id":"id",
	 "parent_category _id":0
}

// Products Counter check
	db.get("productCounter", function(err, res) {
		  		  if (err) {
		  			  console.log('Product Counter existince check failed with error... ');
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
		  			  console.log('Category Counter existince check failed with error... ');
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
		  			  console.log('Supplier Counter existince check failed with error... ');
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

// Populate DB with data from Procter & Gamble
// Parse CSV file for Procter & Gamble
var stream = fs.createReadStream("./conf/P&G DEC Updated Price List nw.csv");
var parsedRecordInMemory = [];
csv
 .fromStream(stream,{headers:true})
 .transform(function(parsedRecord){   parsedRecordInMemory.push(parsedRecord); })
 .on("data", function(data){
	 console.log("the category inserted in db is  " + data.Category);
 })
 .on("end", function(){
    console.log("done");
	parsedRecordInMemoryLength = parsedRecordInMemory.length
	insertCategoryIntoDB(parsedRecordInMemory[parsedRecordIndex]); 	 
 });
var parsedRecordIndex=0;
var parsedRecordInMemoryLength = parsedRecordInMemory.length;
var insertCategoryIntoDB = function(parsedRecord) {		  		  
			console.log("the parsed record before transformation is " + parsedRecord.Category);
		  	db.get("categ::name::"+parsedRecord.Category, function(err, res){
			 if (err) {
		  			  console.log('category with name '+parsedRecord.Category +' does not exist hence it needs to be created',err);
					   // increment category counter
						 db.counter('categoryCounter', 1, function(err, res) {
						  if (err) {
								console.log('category counter increment failed', err);
								return;
							  }
							  // insert the category with incremented counter
							  categoryObj.category_name=parsedRecord.Category;
							  var categoryId = res.value;
							  categoryObj.id=categoryId;
							  db.upsert("categoryCounter::"+categoryId, categoryObj, function(err, res){
									if (err) {;
										console.log('category creation failed for name ' + parsedRecord.Category, err);
										return;
									}
									// inserting a lookup key with categoryname as key and category id as value
									db.upsert("categ::name::"+parsedRecord.Category,categoryId, function(err, res){
										if (err) {;
											console.log('category look-up key creation failed for category name ' + parsedRecord.Category + " and id -" + categoryId, err);
											
											return;
										}
										parsedRecordIndex++;
										if(parsedRecordIndex < parsedRecordInMemoryLength){
											insertCategoryIntoDB(parsedRecordInMemory[parsedRecordIndex]); 	
										}
										
										
									});
								});
						 });
						 
						 return;
					   }
				console.log('category with name '+parsedRecord.Category +' exists hence it need not be created', res);
				console.log("Parsed record index current value is " + parsedRecordIndex);
				console.log("Parsed record in memory length is " + parsedRecordInMemoryLength);
				parsedRecordIndex++;
				if(parsedRecordIndex < parsedRecordInMemoryLength){
						insertCategoryIntoDB(parsedRecordInMemory[parsedRecordIndex]); 	
				}
						 
            });
			
  				  	
		}

