/**
 * Created by ghanavela on 3/20/2016.
 */
app.controller('CartCtrl', function($scope, $rootScope, $ionicLoading, $http, EnvConfig){

    $scope.cartDetails = "ddd";
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $http({
        method: 'GET',
        url: EnvConfig.HOST+'shoppingcart/'
    }).then(function successCallback(data) {
        //console.log(data.data.data[0].Bulkwize.updatedAt);
        if(data.data.data.length > 0){
            $scope.cartDetails = data.data.data[0].Bulkwize;
        }else{
            $rootScope.cartNumber = false;
            $scope.cartDetails = [];
        }

        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    $scope.delete = function(data){
        console.log(data);

        $scope.variants = [];

        for(var i =0 ; i< data.variants.length; i++){

            $scope.variants.push({"sku_id":data.variants[i].sku_id,"quantity":data.variants[i].productOrderedQty,"productCountInCase":data.variants[i].productCountInCase,"productUnitSizeWeightQty":data.variants[i].productUnitSizeWeightQty,"productMRPUnit":data.variants[i].productMRPUnit,"productDiscountPercentage":data.variants[i].productDiscountPercentage});
        }

        console.log($scope.variants);


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $http({
            method: 'DELETE',
            url: EnvConfig.HOST+'shoppingcart/product',
            headers: {"Content-Type": "application/json;charset=utf-8"},
            data:
            {
                "type": "com.bulkwise.Cart",
                "id": "com.bulkwise.Cart::John",
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
                "updatedAt": "ToBeAddedByServer",
                "createdAt": "ToBeAddedByServer",
                "workflowState":"ProductRemoved"
            },
        }).then(function successCallback(response) {
            console.log(response.data.message);
            if(response.data.message == 'success'){
                $http({
                    method: 'GET',
                    url: EnvConfig.HOST+'shoppingcart/'
                }).then(function successCallback(data) {
                    console.log(data.data);
                    if(data.data.data.length > 0){
                        $rootScope.cartNumber = data.data.data[0].Bulkwize.totalCount;
                        $scope.cartDetails = data.data.data[0].Bulkwize;
                        $ionicLoading.show({ template: 'Item Deleted!', noBackdrop: true, duration: 2000 });
                        console.log($rootScope.cartNumber);
                    }else{
                        $rootScope.cartNumber = false;
                        $scope.cartDetails = [];
                    }

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

    $scope.addCart = function(data){
        console.log(data);

        $scope.variants = [];
        $scope.cartProcess = '';
        for(var i =0 ; i< data.variants.length; i++){
            if(data.variants[i].quantity == 0){
                $scope.cartProcess = false;
            }
            $scope.variants.push({"sku_id":data.variants[i].sku_id,"quantity":data.variants[i].quantity,"productCountInCase":data.variants[i].productCountInCase,"productUnitSizeWeightQty":data.variants[i].productUnitSizeWeightQty,"productMRPUnit":data.variants[i].productMRPUnit,"productDiscountPercentage":data.variants[i].productDiscountPercentage});
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
                    "id": "com.bulkwise.Cart::John",
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
                    "workflowState": "created",
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
        console.log(data.quantity++);
    }

    $scope.decrement = function(data){
        if(data.quantity != 0){
            data.quantity--;
        }
    }
});
