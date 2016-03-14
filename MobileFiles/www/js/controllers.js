var app = angular.module('starter.controllers', [])

.directive('owlSlider', function ($ionicSideMenuDelegate) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            $ionicSideMenuDelegate.canDragContent(false);
            scope.initCarousel = function(element) {
                $(element).owlCarousel({
                    autoPlay: false,
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    items: 3,
                    itemsDesktop: [1199, 3],
                    itemsDesktopSmall: [979, 3],
                    itemsTablet: [600, 3], 
                    itemsMobile: false
                });
            };
        }
    };
})

.directive('owlCarouselItem', function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element) {
          // wait for the last item in the ng-repeat then call init
            if(scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
})

.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $http,
                                $ionicLoading,$ionicHistory,$ionicNavBarDelegate,
                                $ionicSideMenuDelegate,$state,AuthServices) {


      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});
    
    $rootScope.cartNumber = 0;

    $scope.isLogin =  AuthServices.isLogin;
    $scope.userDetails = AuthServices.getUserDetails();
    console.log($scope.userDetails);
    $scope.logout = function(){
        $ionicHistory.clearHistory();
        $ionicNavBarDelegate.showBackButton(false)
        $scope.isLogin = AuthServices.isLogin = false;
        $scope.userDetails = [];
        localStorage.setItem("isLogin",false);
        localStorage.setItem("USER_DETAILS",'[]');
        $state.go('app.home');
        $ionicSideMenuDelegate.toggleLeft();
        console.log(AuthServices);
    };



  // Form data for the login modal
    $scope.loginData = {};

  // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

  // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

  // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

  // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
    };

    $http({
        method: 'GET',
        url: 'http://52.73.228.44:8080/shoppingcart/'
    }).then(function successCallback(data) {
        console.log(data.data);
        // $rootScope.cartNumber = data.data.data[0].Bulkwize.totalCount;
        // $ionicLoading.show({ template: 'Item Added!', noBackdrop: true, duration: 2000 });
        console.log($rootScope.cartNumber);
        // $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

})

.controller('HomeCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $ionicSlideBoxDelegate) {

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.category = [];
    $http({
        method: 'GET',
        url: 'http://52.73.228.44:8080/category'
    }).then(function successCallback(data) {
        console.log(data.data.data);
        for ( i = 0; i<data.data.data.length; i++){  
            if(data.data.data[i].Bulkwize.parentCategoryId == 0){
                $scope.category.push(data.data.data[i]);
            }
        };
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    $http({
        method: 'GET',
        url: 'http://52.73.228.44:8080/promotion/carousel'
    }).then(function successCallback(data) {
        console.log(data.data.carouselURLs);
        $scope.promotionImage = data.data.carouselURLs;
        $ionicSlideBoxDelegate.update();
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    console.log($rootScope.cartNumber);

})

.controller('SupplierCtrl', function($scope, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, $state) {

    

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
                url: 'http://52.73.228.44:8080/supplier/',
                data: {
                    "supplierFirstName" : user.firstname,
                    "supplierLastName" : user.lastname,
                    "supplierBusinessName" : "Bulkwize",
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

.controller('CategoryListCtrl', function($scope, $stateParams, $http, $rootScope, $ionicLoading) {

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.loadMore = function(){
        $http({
            method: 'GET',
            url: 'http://localhost/mobile/www/js/dummy.json'
        }).then(function successCallback(response) {
            $scope.lists = response.data.data;
            console.log(response.data.data);
            $ionicLoading.hide();
        }, function errorCallback(data) {
            console.log(data);
            $ionicLoading.hide();
        });
    }

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

})

.controller('CartCtrl', function($scope, $rootScope, $ionicLoading, $http){

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $http({
        method: 'GET',
        url: 'http://52.73.228.44:8080/shoppingcart/'
    }).then(function successCallback(data) {
        console.log(data.data.data[0].Bulkwize.updatedAt);
        $scope.cartDetails = data.data.data[0].Bulkwize;
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
            url: 'http://52.73.228.44:8080/shoppingcart/product',
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
                "updatedAt": "2016-02-20T10:34:08.149Z"
            },
        }).then(function successCallback(response) {
            console.log(response.data.message);
            if(response.data.message == 'success'){
                $http({
                    method: 'GET',
                    url: 'http://52.73.228.44:8080/shoppingcart/'
                }).then(function successCallback(data) {
                    console.log(data.data);
                    $rootScope.cartNumber = data.data.data[0].Bulkwize.totalCount;
                    $ionicLoading.show({ template: 'Item Deleted!', noBackdrop: true, duration: 2000 });
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
                url: 'http://52.73.228.44:8080/shoppingcart',
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
                        url: 'http://52.73.228.44:8080/shoppingcart/'
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
})

.controller('SubCategoryBrandCtrl', function($scope, $state, $stateParams, $http, $rootScope, $ionicLoading){

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

    $http({
        method: 'GET',
        url: 'http://52.73.228.44:8080/category/'+$stateParams.subId+'/subcategory'
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
            url: 'http://52.73.228.44:8080/category/brand/search',
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

.controller('SubCategoryCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope){

    $scope.title = $stateParams.prodname;

    console.log($rootScope.suBrandId);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    
    $http({
        method: 'POST',
        url: 'http://52.73.228.44:8080/products/search',
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

        $scope.cartProcess = '';
        $scope.variants = [];

        for(var i =0 ; i< data.brand.productVariants.length; i++){
            
            if(data.brand.productVariants[i].productOrderedQty == 0){
                $scope.cartProcess = false;
            }

            $scope.variants.push({"sku_id":data.brand.productVariants[i].sku_id,"quantity":data.brand.productVariants[i].productOrderedQty,"productCountInCase":data.brand.productVariants[i].productCountInCase,"productUnitSizeWeightQty":data.brand.productVariants[i].productUnitSizeWeightQty,"productMRPUnit":data.brand.productVariants[i].productMRPUnit,"productDiscountPercentage":data.brand.productVariants[i].productDiscountPercentage});
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
                url: 'http://52.73.228.44:8080/shoppingcart',
                data:
                {
                    "type": "com.bulkwise.Cart",
                    "id": "com.bulkwise.Cart::John",
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
                    "createdAt": "2016-02-20T10:34:08.149Z",
                    "updatedAt": data.updatedAt
                },
            }).then(function successCallback(response) {
                console.log(response);
                if(response.data.message == 'success'){
                    $http({
                        method: 'GET',
                        url: 'http://52.73.228.44:8080/shoppingcart/'
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

.controller('CategoryDetailCtrl', function($scope, $stateParams, $http, $rootScope, $ionicSlideBoxDelegate, $ionicLoading) {

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    $scope.shortForm =[];
    $scope.discount = [];

    $http({
        method: 'GET',
        url: 'http://52.73.228.44:8080/products/'+$stateParams.pId
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
        $scope.cartProcess = '';
        for(var i =0 ; i< data.productVariants.length; i++){
            if(data.productVariants[i].productOrderedQty == 0){
                $scope.cartProcess = false;
            }
            $scope.variants.push({"sku_id":data.productVariants[i].sku_id,"quantity":data.productVariants[i].productOrderedQty,"productCountInCase":data.productVariants[i].productCountInCase,"productUnitSizeWeightQty":data.productVariants[i].productUnitSizeWeightQty,"productMRPUnit":data.productVariants[i].productMRPUnit,"productDiscountPercentage":data.productVariants[i].productDiscountPercentage});
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
                url: 'http://52.73.228.44:8080/shoppingcart',
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
                        url: 'http://52.73.228.44:8080/shoppingcart/'
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

.controller('SearchCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state){

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
        url: 'http://52.73.228.44:8080/products/likeSearch/'+$stateParams.searchId
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

.controller('ShippingCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state){

    $scope.user = [];
    $scope.user.city = 'Bangalore'
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
                url: 'http://52.73.228.44:8080/shoppingcart/shippingDetails',
                data: {
                    "customer_id": "John",
                    "id": "com.bulkwise.Cart::John",
                    "shipping_address": {
                        "address1": user.address1,
                        "address2": user.address2,
                        "postcode" : user.postcode,
                        "city" : user.city,
                        "state" : user.state,
                        "country" : user.country
                    },
                    "type": "com.bulkwise.Cart",
                    "updatedAt": "2016-02-24T12:00:55.501Z",
                    "workflow_states": {
                        "Shipping added": ""
                    }
                },
            }).then(function successCallback(response) {
                console.log(response.status);
                if(response.status == 200){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Thanks for providing the details !'
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

.controller('ConfirmCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state){

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $http({
        method: 'GET',
        url: 'http://52.73.228.44:8080/shoppingcart/'
    }).then(function successCallback(data) {
        console.log(data.data.data[0].Bulkwize.updatedAt);
        $scope.cartDetails = data.data.data[0].Bulkwize;
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    $scope.confirm = function(){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $http({
            method: 'POST',
            url: 'http://52.73.228.44:8080/order/John',
        }).then(function successCallback(response) {
            console.log(response);
            
            $ionicLoading.hide();
        }, function errorCallback(data) {
            console.log(data);
            $ionicLoading.hide();
        });
    }

});
