/**
 * Created by harman on 08/02/2016.
 */

var db = require('./index.js').bucket;
var dummySuppliers = require('./conf/dummy-supplier.json');
var csv = require('fast-csv');
var fs = require('fs');
var moment = require( 'moment' );

var productCounter = 0; // this is only for first time, else retrieve this value from the counter below.
var categoryCounter = 0; // this is only for first time, else retrieve this value from the counter below.
var supplierCounter = 0; // this is only for first time, else retrieve this value from the counter below.

var parsedCategoryIndex=0;
var stream = fs.createReadStream("./conf/P&G DEC Updated Price List nw-6.csv");
//var stream = fs.createReadStream("./conf/Nestle-processed.csv");
var parsedRecordInMemory = [];

var currentUTCdate = new Date(moment().utc().format());

var categoryObj = {
	 "type":"com.bulkwize.category",
	 "category_name":"Personal Care",
	 "category_img_url":"../images/category/personal_care.img",
	 "category_icon_url":"../icons/category/personal_care.img",
	 "maximum_discount_percentage":65, 
	 "id":"id",
	 "parentCategoryId":0
}

var productObj = {
"type":"com.bulkwise.Products",
"id":"id",
"productDisplayTitle" : "Gillete Mach 3 razor, titanium blade",
"productBrandName":"Gillete",
"productBrandImageURL": "This is product brand image URL ",
"productShortSummary": "A very short summary to be displayed along with title.",
"productDescription": "A detailed description about the product",
"productName": "Gillete Mach 3",
"productImageURL":"This is product image url",
"productIsVisible":true,
"productVariants":[{
		"sku_id":"id",
		"productItemId":" 82243252",
		"productMaterialCode":" 82242983",
		"productMaterialDescription":" Mach 3 turbo pack of 3",
		"productEAN":" 4902430665452",
		"productCountInCase":50,
		"productOrderedQty":0,
		"productUnitSizeWeightQty":"3",
		"productMRPUnit": 550,
		"productDiscountPercentage": 9,
		"productVariantIsVisible":true,
		"productVATPercentage":"14.5",
		"productVariantPriceApplicableUpto":currentUTCdate
		}],
 "prd_metafields":[ {
         "key":"attribute1",
         "value":"value1"
        } ],
"createdAt":currentUTCdate,
"updatedAt":currentUTCdate,
"productCategoryId":["array","because a product can belong to multiple categories"],
"supplier_business_name": "suppl::1",
"override_lead_time_for_delivery_in_days":"5-7 days"
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
csv
 .fromStream(stream,{headers:true})
 .transform(function(parsedRecord){   parsedRecordInMemory.push(parsedRecord); })
 .on("data", function(data){
	 console.log("the category inserted in db is  " + data.Category);
 })
 .on("end", function(){
    console.log("parsing done");
	parsedRecordInMemoryLength = parsedRecordInMemory.length
	insertCategoryIntoDB(parsedRecordInMemory[parsedCategoryIndex]); 	 
 });

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
							  categoryObj.parentCategoryId=0;
							  categoryObj.category_img_url=parsedRecord.CategoryImageURL;
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
										console.log("Calling insert subcategory to see if the subcategory needs to be added");
										insertSubCategoryIntoDB(parsedRecord,categoryId);
									});
								});
						 });
						 
						 return;
					   }
				console.log('category with name '+parsedRecord.Category +' exists hence it need not be created', res);
				console.log("Parsed record index current value is " + parsedCategoryIndex);
				console.log("Parsed record in memory length is " + parsedRecordInMemoryLength);
				console.log("Calling insert subcategory to see if the subcategory needs to be added");
				insertSubCategoryIntoDB(parsedRecord,res.value);
			});
			
  				  	
		}

var insertSubCategoryIntoDB = function(parsedRecord, parentCategoryId) {		  		  
			console.log("the parsed record before transformation is " + parsedRecord.SubCategory);
			console.log("the parent categoryid for subcategory " + parsedRecord.SubCategory + " is --" + parentCategoryId);
		  	db.get("categ::name::"+parsedRecord.SubCategory, function(err, res){
			 if (err) {
		  			  console.log('category with name '+parsedRecord.SubCategory +' does not exist hence it needs to be created',err);
					   // increment category counter
						 db.counter('categoryCounter', 1, function(err, res) {
						  if (err) {
								console.log('category counter increment failed', err);
								return;
							  }
							  // insert the category with incremented counter
							  categoryObj.category_name=parsedRecord.SubCategory;
							  var categoryId = res.value;
							  categoryObj.id=categoryId;
							  categoryObj.parentCategoryId=parentCategoryId;
							  categoryObj.category_img_url=parsedRecord.SubCategoryImageURL;
							  db.upsert("categoryCounter::"+categoryId, categoryObj, function(err, res){
									if (err) {;
										console.log('category creation failed for name ' + parsedRecord.SubCategory, err);
										return;
									}
									// inserting a lookup key with categoryname as key and category id as value
									db.upsert("categ::name::"+parsedRecord.SubCategory,categoryId, function(err, res){
										if (err) {;
											console.log('category look-up key creation failed for category name ' + parsedRecord.SubCategory + " and id -" + categoryId, err);
											
											return;
										}
										insertProductIntoDB(parsedRecord,parentCategoryId,categoryId);
										
										
									});
								});
						 });
						 
						 return;
					   }
				console.log('Subcategory with name '+parsedRecord.SubCategory +' exists hence it need not be created', res);
				console.log("Parsed record index current value is " + parsedCategoryIndex);
				console.log("Parsed record in memory length is " + parsedRecordInMemoryLength);
				insertProductIntoDB(parsedRecord,parentCategoryId,res.value);
						 
            });
			
  				  	
		}
var productId = 1;
var insertProductIntoDB = function(parsedRecord, parentCategoryId, subCategoryId) {		  		  
			console.log("the parsed record before transformation is " + parsedRecord.MaterialDescription);
			console.log("the parent subcategoryId for product " + parsedRecord.MaterialDescription + " is --" + subCategoryId);
			if(parsedRecord.VariantOfPrevious != undefined && parsedRecord.VariantOfPrevious != null && parsedRecord.VariantOfPrevious == 'Y'){
				console.log("the newly read record is a variant of previous one");
				db.get("com.bulkwise.Product::"+productId, function(err, res){
					if (err) {
						console.log('While processing variant record, could not fetch the existing product from db', err);
						return;
					}
					console.log("While processing variant record, the existing product fetched is -- " + JSON.stringify(res));
					
					var pdtFromDB = res.value;
					console.log("While processing variant record, the existing product varaints fetched is -- " + JSON.stringify(pdtFromDB.productVariants));
					var newVariant = {
						sku_id:parsedRecord.EAN,
						productItemId:parsedRecord.ItemID,
						productMaterialCode:parsedRecord.Matcode,
						productUnitSizeWeightQty= parsedRecord.ProductSizeWeightQty,
						productMaterialDescription:parsedRecord.MaterialDescription,
						productEAN:parsedRecord.EAN,
						productCountInCase:parsedRecord.CaseCount,
						productMRPUnit:parsedRecord.MRP,
						productOrderedQty:0,
						productDiscountPercentage:parsedRecord.ProductDiscountPercentage,
						productVATPercentage:parsedRecord.VAT
					}
					pdtFromDB.productVariants.push(newVariant);
					db.upsert("com.bulkwise.Product::"+productId, pdtFromDB, function(err, res){
					if (err) {
						console.log('product creation failed for name ' + parsedRecord.MaterialDescription, err);
						return;
					}
					
				});
				});
			} else{// end of variant check
		  	// increment product counter
			db.counter('productCounter', 1, function(err, res) {
				if (err) {
					console.log('product counter increment failed', err);
					return;
				}
				// insert the product with incremented counter
				 productId = res.value;
				productObj.id=productId;
				productObj.productDisplayTitle= parsedRecord.DisplayTitle;
				productObj.productBrandName=parsedRecord.Brand;
				productObj.productBrandImageURL=parsedRecord.BrandImgURL;
				productObj.productImageURL=parsedRecord.ProductImgURL;
				productObj.productShortSummary = parsedRecord.ShortSummary;
				productObj.productDescription =  parsedRecord.MaterialDescription;
				productObj.productName=parsedRecord.DisplayTitle;
				productObj.supplier_business_name=parsedRecord.SupplierBusinessName;
				productObj.override_lead_time_for_delivery_in_days=parsedRecord.LeadTimeForDelivery;
				productObj.productVariants[0].sku_id=productId;
				productObj.productVariants[0].productItemId=parsedRecord.ItemID;
				productObj.productVariants[0].productMaterialCode=parsedRecord.Matcode;
				productObj.productVariants[0].productMaterialDescription=parsedRecord.MaterialDescription;
				productObj.productVariants[0].productEAN=parsedRecord.EAN;
				productObj.productVariants[0].productOrderedQty=0;
				productObj.productVariants[0].productCountInCase=parsedRecord.CaseCount;
				productObj.productVariants[0].productMRPUnit=parsedRecord.MRP;
				productObj.productVariants[0].productDiscountPercentage=parsedRecord.ProductDiscountPercentage;
				productObj.productVariants[0].productVATPercentage=parsedRecord.VAT;
				productObj.productCategoryId[0] = parentCategoryId;
				productObj.productCategoryId[1] = subCategoryId;
				db.upsert("com.bulkwise.Product::"+productId, productObj, function(err, res){
					if (err) {
						console.log('product creation failed for name ' + parsedRecord.MaterialDescription, err);
						return;
					}
					
				});
			});
			}
			parsedCategoryIndex++;
			if(parsedCategoryIndex < parsedRecordInMemoryLength){
				insertCategoryIntoDB(parsedRecordInMemory[parsedCategoryIndex]); 	
			}
				  	
		}
		

