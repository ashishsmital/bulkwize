app.controller('SubCategoryCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope,EnvConfig){

    $scope.title = $stateParams.prodname;
	if($stateParams.suBrandId && $stateParams.suBrandId != null){
		$rootScope.suBrandId = $stateParams.suBrandId;
	}

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

});
