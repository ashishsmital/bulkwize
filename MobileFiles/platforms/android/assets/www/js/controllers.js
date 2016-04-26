var app = angular.module('starter.controllers', []);
app.controller('SupplierCtrl', function($scope, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, $state,EnvConfig) {

	$scope.user = {};
	$scope.city='Bangalore';
	$scope.user.city='Bangalore';

    $scope.submit = function(valid, user){
        console.log(valid);
        if(valid){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $http({
                method: 'POST',
                url: EnvConfig.HOST+'supplier/',
                data: {
                    "supplierFirstName" : user.firstname,
                    "supplierLastName" : user.lastname,
                    "supplierBusinessName" : user.businessname,
                    "supplierLeadTimeToDeliver" : 5,
                    "supplierBusinessAddress": {
                        "country" : "INDIA",
                        "city" : user.city
                    },
                    "supplierContactDetails":{
                        "mobileNumber":user.mobileNumber,
                        "emailAddress":"abc@png.com"
                    }
                },
            }).then(function successCallback(response) {
                console.log(response.status);
                if(response.status == 200){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Thanks for providing the details ! <br>We value your interest and will get in touch with you shortly to discuss the next steps.'
                    });

                    alertPopup.then(function(res) {
                        console.log(res);
                        if(res == true){
                            $state.go('app.home');
                        }
                    });
                }
                $ionicLoading.hide();
            }, function errorCallback(data) {
                console.log(data);
                $ionicLoading.hide();
            });
        }
    }

})

.controller('SubCategoryBrandCtrl', function($scope, $state, $stateParams, $http, $rootScope, $ionicLoading,EnvConfig){

    $scope.checked = [];

    $scope.title = $stateParams.productName;
    console.log($scope.title);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
		$scope.envHost = EnvConfig.HOST.substring(0, EnvConfig.HOST.length - 1);

    $http({
        method: 'GET',
        url: EnvConfig.HOST+'category/'+$stateParams.subId+'/subcategory'
    }).then(function successCallback(data) {
        console.log(data.data.data);
        $scope.subCategory = data.data.data;
        if($scope.subCategory.length){
            $scope.checked = [data.data.data[0].Bulkwize.id];
            $scope.productList(data.data.data[0].Bulkwize.id);
        }else{
            $ionicLoading.hide();
        }
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    $scope.change = function(value) {

        $scope.newCheckedArray = [];
        for (var i = 0; i < $scope.checked.length; i++) {
            if ($scope.checked[i] !== undefined && $scope.checked[i] !== null && $scope.checked[i] !== "") {
                $scope.newCheckedArray.push($scope.checked[i]);
            }
        }
        $scope.productList($scope.newCheckedArray);
    };

    $scope.productList = function(subcatgid){
        console.log(subcatgid);
        $rootScope.suBrandId = subcatgid;

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $http({
            method: 'POST',
            url: EnvConfig.HOST+'category/brand/search',
            data: {
                "categoryIds":subcatgid
            },
        }).then(function successCallback(response) {
            console.log(response.data.data);
            $scope.lists = response.data.data;
            console.log($scope.lists.length);
            setTimeout(function() {
                $ionicLoading.hide();
            }, 1000);
        }, function errorCallback(data) {
            console.log(data);
            $ionicLoading.hide();
        });
    }



    $scope.categoryLink = function(list){
        $state.go('app.subcategory', {prodname:list.brand.productBrandName});
    }

})

.controller('SubCategoryCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope,EnvConfig){

    $scope.title = $stateParams.prodname;

    console.log($rootScope.suBrandId);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.envHost = EnvConfig.HOST.substring(0, EnvConfig.HOST.length - 1);
    $http({
        method: 'POST',
        url: EnvConfig.HOST+'products/search',
        data: {
            "categoryIds":$rootScope.suBrandId,
            "productBrandName":$scope.title
        },
    }).then(function successCallback(response) {
        console.log(response.data.data);
        $scope.lists = response.data.data;
        console.log($scope.lists.length);
        setTimeout(function() {
            $ionicLoading.hide();
        }, 1000);
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    $scope.addCart = function(data){
        console.log(data);

        $scope.cartProcess = false;
        $scope.variants = [];

        for(var i =0 ; i< data.brand.productVariants.length; i++){

            if(data.brand.productVariants[i].productOrderedQty != 0){
                // if the quantity selected for the product variant is > 0 only then process the cart and push the variant else ignore.
				$scope.cartProcess = true;

				$scope.variants.push({"sku_id":data.brand.productVariants[i].sku_id,"quantity":data.brand.productVariants[i].productOrderedQty,"productCountInCase":data.brand.productVariants[i].productCountInCase,"productUnitSizeWeightQty":data.brand.productVariants[i].productUnitSizeWeightQty,"productMRPUnit":data.brand.productVariants[i].productMRPUnit,"productDiscountPercentage":data.brand.productVariants[i].productDiscountPercentage});
            }
        }

        console.log($scope.variants);

        if($scope.cartProcess === false){
            $ionicLoading.show({ template: 'Select the Order Qty !', noBackdrop: true, duration: 2000 });
        }else{
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $http({
                method: 'PUT',
                url: EnvConfig.HOST+'shoppingcart',
                data:
                {
                    "type": "com.bulkwise.Cart",
                    "id": "",
                    "customer_id": "",
                    "business_id": "123456789",
                    "products": [
                        {
                            "id": data.brand.id,
                            "productDisplayTitle" : data.brand.productDisplayTitle,
                            "productBrandName": data.brand.productBrandName,
                            "productBrandImageURL": data.brand.productBrandImageURL,
                            "productShortSummary": data.brand.productShortSummary,
                            "productDescription": data.brand.productDescription,
                            "productName": data.brand.productName,
                            "productImageURL": data.brand.productImageURL,
                            "quantity": "10",
                            "variants":$scope.variants
                        }
                    ],
                    "coupon_code": "10% discount",
                    "billing_address": {
                        "address": ""
                    },
                    "shipping_address": {
                        "address": ""
                    },
                    "total_cart_value_after_discount": 182,
                    "workflow_states": {
                        "created": ""
                    },
					"override_lead_time_for_delivery_in_days":data.brand.override_lead_time_for_delivery_in_days,
					"supplier_business_name":data.brand.supplier_business_name,
                    "createdAt": "2016-02-20T10:34:08.149Z",
                    "updatedAt": data.updatedAt
                },
            }).then(function successCallback(response) {
                console.log(response);
                if(response.data.message == 'success'){
                    $http({
                        method: 'GET',
                        url: EnvConfig.HOST+'shoppingcart/'
                    }).then(function successCallback(data) {
                        console.log(data.data);
                        $rootScope.cartNumber = data.data.data[0].Bulkwize.totalCount;
                        $ionicLoading.show({ template: 'Item Added!', noBackdrop: true, duration: 2000 });
                        console.log($rootScope.cartNumber);
                        // $ionicLoading.hide();
                    }, function errorCallback(data) {
                        console.log(data);
                        $ionicLoading.hide();
                    });
                }
                $ionicLoading.hide();
            }, function errorCallback(data) {
                console.log(data);
                $ionicLoading.hide();
            });
        }

    }

    $scope.increment = function(data){
        console.log(data.productOrderedQty++);
    }

    $scope.decrement = function(data){
        if(data.productOrderedQty != 0){
            data.productOrderedQty--;
        }
    }

})

.controller('CategoryDetailCtrl', function($scope, $stateParams, $http, $rootScope, $ionicSlideBoxDelegate, $ionicLoading,EnvConfig) {

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    $scope.shortForm =[];
    $scope.discount = [];

		//envHost+detail.productBrandImageURL
	$scope.envHost = EnvConfig.HOST.substring(0, EnvConfig.HOST.length - 1);

    $http({
        method: 'GET',
        url: EnvConfig.HOST+'products/'+$stateParams.pId
    }).then(function successCallback(response) {
        $ionicLoading.hide();
			console.log(response.data.data[0].Bulkwize);
        $scope.detail = response.data.data[0].Bulkwize;
        $scope.title = response.data.data[0].Bulkwize.productBrandName;
        $scope.shortForm = response.data.data[0].Bulkwize.productVariants;
        for(var i =0; i < $scope.shortForm.length; i++){
            // $scope.temp = $scope.shortForm[i].productMRPUnit - ($scope.shortForm[i].productDiscountPercentage*$scope.shortForm[i].productMRPUnit/100);

            // $scope.shortForm.push({$scope.shortForm[i].productMRPUnit:$scope.temp});
            console.log($scope.discount);
        }
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });


    $scope.addCart = function(data){
        console.log(data);

        $scope.variants = [];
        $scope.cartProcess = false;
        for(var i =0 ; i< data.productVariants.length; i++){
            if(data.productVariants[i].productOrderedQty != 0){
                $scope.cartProcess = true;
				$scope.variants.push({"sku_id":data.productVariants[i].sku_id,"quantity":data.productVariants[i].productOrderedQty,"productCountInCase":data.productVariants[i].productCountInCase,"productUnitSizeWeightQty":data.productVariants[i].productUnitSizeWeightQty,"productMRPUnit":data.productVariants[i].productMRPUnit,"productDiscountPercentage":data.productVariants[i].productDiscountPercentage});
            }

        }

        console.log($scope.variants, $scope.cartProcess);

        if($scope.cartProcess === false){
            $ionicLoading.show({ template: 'Select the Order Qty !', noBackdrop: true, duration: 2000 });
        }else{

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $http({
                method: 'PUT',
                url: EnvConfig.HOST+'shoppingcart',
                data:
                {
                    "type": "com.bulkwise.Cart",
                    "id": "",
                    "customer_id": "",
                    "business_id": "123456789",
                    "products": [
                        {
                            "id": data.id,
                            "productDisplayTitle" : data.productDisplayTitle,
                            "productBrandName": data.productBrandName,
                            "productBrandImageURL": data.productBrandImageURL,
                            "productShortSummary": data.productShortSummary,
                            "productDescription": data.productDescription,
                            "productName": data.productName,
                            "productImageURL": data.productImageURL,
                            "quantity": "10",
                            "variants":$scope.variants
                        }
                    ],
                    "coupon_code": "10% discount",
                    "billing_address": {
                        "address": ""
                    },
                    "shipping_address": {
                        "address": ""
                    },
                    "total_cart_value_after_discount": 182,
                    "workflow_states": {
                        "created": ""
                    },
                    "createdAt": "2016-02-20T10:34:08.149Z",
                    "updatedAt": data.updatedAt
                },
            }).then(function successCallback(response) {
                console.log(response.data.message);
                if(response.data.message == 'success'){
                    $http({
                        method: 'GET',
                        url: EnvConfig.HOST+'shoppingcart/'
                    }).then(function successCallback(data) {
                        console.log(data.data);
                        $rootScope.cartNumber = data.data.data[0].Bulkwize.totalCount;
                        $ionicLoading.show({ template: 'Item Added!', noBackdrop: true, duration: 2000 });
                        console.log($rootScope.cartNumber);
                        // $ionicLoading.hide();
                    }, function errorCallback(data) {
                        console.log(data);
                        $ionicLoading.hide();
                    });
                }
                $ionicLoading.hide();
            }, function errorCallback(data) {
                console.log(data);
                $ionicLoading.hide();
            });
        }

    }

    $scope.increment = function(data){
        console.log(data.productOrderedQty++);
    }

    $scope.decrement = function(data){
        if(data.productOrderedQty != 0){
            data.productOrderedQty--;
        }
    }

})

.controller('SearchCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state,EnvConfig){

    console.log($stateParams);

    $scope.brands = [];
    $scope.products = [];

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    $scope.searchKeyword = $stateParams.searchId;
    $http({
        method: 'GET',
        url: EnvConfig.HOST+'products/likeSearch/'+$stateParams.searchId
    }).then(function successCallback(response) {
        console.log(response);
        $scope.lists = response.data.data;
        for( var i =0;i< response.data.data.length; i++){
            if (response.data.data[i].ProductNameSearch) {
                $scope.products.push(response.data.data[i]);
            }else{
                $scope.brands.push(response.data.data[i]);
            }
        }
        console.log($scope.brands, $scope.products);
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    $scope.categoryLink = function(data){
        $rootScope.suBrandId = data.productCategoryId;
        $state.go('app.subcategory', {prodname:data.ProductBrandNameSearch});
    }

})

.controller('ShippingCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $ionicPopup, $state,EnvConfig){

    $scope.user = [];
    $scope.user.city = 'Bangalore';
	$scope.user.state = 'Karnataka';
	$scope.user.country = 'India';

	$http({
        method: 'GET',
        url: EnvConfig.HOST+'user/'
    }).then(function successCallback(response) {

		if(response.status == 200){
				if(response.data.data.length > 0){
					$scope.user.address1 = response.data.data[0].Bulkwize.deliveryAddress.addressLine1;
					$scope.user.address2 = response.data.data[0].Bulkwize.deliveryAddress.addressLine2;
					$scope.user.postcode = response.data.data[0].Bulkwize.deliveryAddress.pincode;
				}

		}



        $ionicLoading.hide();
    }, function errorCallback(response) {
        console.log(response);
		if(response.status == 401){
					var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Ooops! Please login before checkout'
                    });

					alertPopup.then(function(res) {
                        console.log("The user is not logged in and hence needs to be redirected to login page." + res);
                        if(res == true){
                            $state.go('app.login');
                        }
                    });

		}

        $ionicLoading.hide();
    });


    $scope.submit = function(valid, user){
        console.log(valid);
        if(valid){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $http({
                method: 'PUT',
                url: EnvConfig.HOST+'shoppingcart/shippingDetails',
                data: {
                    "customer_id": "",
                    "id": "",
                    "shipping_address": {
                        "address1": user.address1,
                        "address2": user.address2,
                        "postcode" : user.postcode,
                        "city" : user.city,
                        "state" : user.state,
                        "country" : user.country
                    },
                    "type": "com.bulkwise.Cart",
                    "updatedAt": "ToBeAddedByServer",
					"createdAt": "ToBeAddedByServer",
                    "workflowState": "Shipping added"
                },
            }).then(function successCallback(response) {
                console.log(response.status);
                if(response.status == 200){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Please review the order details & confirm !'
                    });

                    alertPopup.then(function(res) {
                        console.log(res);
                        if(res == true){
                            $state.go('app.confirm');
                        }
                    });
                }

                $ionicLoading.hide();
            }, function errorCallback(data) {
                console.log(data);
                $ionicLoading.hide();
            });
        }
    }
})

.controller('ConfirmCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state,$window,EnvConfig){

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    $scope.envHost = EnvConfig.HOST.substring(0, EnvConfig.HOST.length - 1);
    $http({
        method: 'GET',
        url: EnvConfig.HOST+'shoppingcart/'
    }).then(function successCallback(data) {
        console.log(data.data.data[0].Bulkwize.updatedAt);
        $scope.cartDetails = data.data.data[0].Bulkwize;
		$scope.isCODapplicable = parseFloat($scope.cartDetails.totalCartValue.replace(',','')) <= parseFloat('10000');
		console.log("Is COD applicable -- " + $scope.isCODapplicable);
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
		$ionicLoading.hide();
    });

   	$scope.cod = function(){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $http({
            method: 'POST',
            url: EnvConfig.HOST+'order/create/',
        }).then(function successCallback(response) {
            console.log(response);
            $ionicLoading.hide();
			$rootScope.orderId=response.data.data.id;
			$state.go('app.finalsummary');
        }, function errorCallback(data) {
            console.log(data);
            $ionicLoading.hide();
        });
    }

	$scope.payment = function(){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $http({
            method: 'POST',
            url: EnvConfig.HOST+'order/create/',
        }).then(function successCallback(response) {
            console.log(response);

            $ionicLoading.hide();
			 // if order creation is successful - make payment
			$http({
				method: 'POST',
				url: EnvConfig.HOST+'payment/'+response.data.data.id
			}).then(function successCallback(pmntResponse) {
				console.log("Payment creation was successful" + pmntResponse.data.data.pmntURL);
				$ionicLoading.hide();

				// if payment creation is successful, invoke instamojo long URL
				$window.location.href=pmntResponse.data.data.pmntURL;

				// end of invoking instamojo long url
			}, function errorCallback(data) {
				console.log( "Payment creation failed" + data);
				$ionicLoading.hide();
			});
			// end of payment creation
        }, function errorCallback(data) {
            console.log(data);
            $ionicLoading.hide();
        });
    }

})

.controller('FinalSummaryCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state,$window,EnvConfig){

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $http({
        method: 'GET',
        url: EnvConfig.HOST+'order/orderid/'+$rootScope.orderId+'/'
    }).then(function successCallback(data) {
        console.log(data.data.data[0].Bulkwize.updatedAt);
        $scope.cartDetails = data.data.data[0].Bulkwize;
		$ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
		$ionicLoading.hide();
    });


});
