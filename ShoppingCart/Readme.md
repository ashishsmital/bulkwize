Get All the cart details saved earlier:
-------------------------------------

GET

URL : http://localhost:8080/shoppingcart/user/loggedin_user_id

Create or update new Cart details: It will also update product quantity based on the product id
------------------------------------

PUT

URL : http://localhost:8080/shoppingcart


Data :

{

"type":"com.bulkwise.Cart",

"id":"com.bulkwise.Cart::userid",

"customer_id":"loggedin_user_id",

"business_id":"business id from below",

"shop id":"shop id from below",

"session_id":"user session id",

"products":[{"id":"123","quantity":"10"}],

"coupon_code":"10% discount",

"billing_address":{"billing address":""},

"shipping_address":{"shipping address":""},

"total_cart_value_after_discount":182,

"workflow_states":{"created":""},

"createdAt" : "2016-02-01T21:52:49.854Z",

"updatedAt" : "2016-02-01T21:53:10.320Z"

}


Deleting a particular or list of products
-----------------------------------

Delete

URL : http://localhost:8080/shoppingcart

Data :

{

"type":"com.bulkwise.Cart",

"id":"com.bulkwise.Cart::userid",

"customer_id":"loggedin_user_id",

"business_id":"business id from below",

"shop id":"shop id from below",

"session_id":"user session id",

"products":[{"id":"123","quantity":"10"}],

"coupon_code":"10% discount",

"billing_address":{"billing address":""},

"shipping_address":{"shipping address":""},

"total_cart_value_after_discount":182,

"workflow_states":{"created":""},

"createdAt" : "2016-02-01T21:52:49.854Z",

"updatedAt" : "2016-02-01T21:53:10.320Z"

}