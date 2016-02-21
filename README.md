
<h2>Products </h2> <br/>

Step 1: Install couch base and create a new bucket bulkwize <br/>
Step 2: CREATE PRIMARY INDEX ON bulkwize USING GSI; - Run this as couchbase 4 onward there is no default index <br/>
Step 3: Go to Products folder <br/>
Step 4: node index.js <br/> 
Step 5: If it is not working then install the package as mentioned below <br/>
Step 6: npm install all the packages<br/> 
Step 7: node index.js <br/>



<h4>Save Products</h4>
-----------------------------

POST : http://localhost:8080/products <br/>

<code>
{
"type":"com.bulkwise.Products",
"id":"produ::9",
 "display_title" : "Gillete Mach 3 razor, titanium blade",
"brand_name":"Gillete",
"Short_summary": "A very short summary to be displayed along with title.",
"description": "A detailed description about the product",
"name": "Gillete Mach 3",
"img_url":"product image url",
 "isVisible":true,
"variants":[{
		"sku_id":"Gillete::1::Mach3",
"supplier_item_id":" 82243252",
		"supplier_material_code":" 82242983",
		"supplier_material_description":" Mach 3 turbo pack of 3",
		"supplier_EAN":" 4902430665452",
		"count_in_case":50,
		"unit size/weight/qty":"3",
		"MRP/unit": 550,
		"discount percentage": 9,
		"isVisible":true,
		"price_applicable_upto":"ISO(date)"
		}],
 "prd_metafields":[ {
         "key":"Material",
         "value":"Cotton"
        },
      {
         "key":"Quality",
         "value":"Excellent"
      }   ],
"createdAt":"2014-04-03T20:46:52.411Z",
"updatedAt":"2016-02-01T21:12:50.699Z",
"category_id":["unique"],
"supplier_id": "suppl::1",
"override_lead_time_for_delivery_in_days":20
}</code>

<h4>Unique Brand Name</h4>
-----------------------------------------

Get URL : http://localhost:8080/products/uniquebrands <br/>

<h4>Get all the products by category name</h4>
-------------------------------------------

Get URL: http://localhost:8080/products/category/Mens


<h4>Get all the products for a given brand name</h4>
-------------------------------------------

Get URL : http://localhost:8080/products/brand/Gillete








