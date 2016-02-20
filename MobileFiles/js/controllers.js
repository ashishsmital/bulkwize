angular.module('starter.controllers', [])

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

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});
    
    $rootScope.cartNumber = 0;

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

})

.controller('HomeCtrl', function($scope, $stateParams, $http, $ionicLoading) {

    $scope.dummyImage = [
        { image: 'http://db-hospitality.com/images/restaurant.jpeg'},
        { image: 'http://www.makeupandbeautyblog.com/wp-content/uploads/2015/11/aveda-shampure-dry-shampoo-2.jpg'},
        { image: 'http://www.perkinsusa.com/wp-content/uploads/2013/06/shutterstock_21820732.jpg'}
    ];

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
                console.log("hello");
            }
        };
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

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

    // $scope.increment = function(data){
    //     $scope.qty++;
    // }

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

})

.controller('CategoryDetailCtrl', function($scope, $stateParams, $http, $rootScope, $ionicSlideBoxDelegate, $state) {

    // $scope.categoryTitle = $stateParams.cid;
    // $scope.data = [];
    // $http({
    //     method: 'GET',
    //     url: 'http://localhost/mobile/www/js/dummy.json'
    // }).then(function successCallback(data) {
    //     //$scope.data = data.data.Dummy;
    //     for (var i = 0; i < data.data.Dummy.length; i++) {
    //         if(data.data.Dummy[i].id == $stateParams.cdid){
    //             $scope.data.push(data.data.Dummy[i]);
    //         }
    //     }
    //     $scope.info = $scope.data[0];
    //     console.log($scope.info);
    // }, function errorCallback(data) {
    //     console.log(data)
    // });

    // $scope.addCart = function(data){
    //     console.log($rootScope.cartNumber);

    //     if($rootScope.cartNumber.length == 0){

    //         $rootScope.cartNumber.push(data[0]);
    //     }else{

    //         for (var i = 0; i < $rootScope.cartNumber.length; i++) {
    //             //console.log($rootScope.cartNumber[i].id != data[0].id);
    //             console.log('helo'+data[0].id);
    //             if($rootScope.cartNumber[i].id != data[0].id){
    //                 $rootScope.cartNumber.push(data[0]);
    //             }
    //         }
    //     }

    //     console.log($rootScope.cartNumber);
    // }

    $scope.addCart = function(data){
        $state.go('app.payment');
        console.log($rootScope.cartNumber);

        $rootScope.cartNumber = 1;

        console.log($rootScope.cartNumber);
    }

    // $ionicSlideBoxDelegate.update();
    // // $ionicSlideBoxDelegate.$getByHandle('mainhanddle').update();

    // console.log($rootScope.cartNumber);
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
        url: 'http://52.73.228.44:8080/shoppingcart/user/John'
    }).then(function successCallback(data) {
        console.log(data.data.data);
        $scope.cartDetails = data.data.data;
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });
})

.controller('SubCategoryCtrl', function($scope, $stateParams, $http, $ionicLoading){

    $scope.checked = [];

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
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });


    // $http({
    //     method: 'GET',
    //     url: 'http://52.73.228.44:8080/products'
    // }).then(function successCallback(response) {
    //     console.log(response.data.data);
    //     $scope.lists = response.data.data;
    //     setTimeout(function() {
    //         $ionicLoading.hide();
    //     }, 2000); 
    // }, function errorCallback(data) {
    //     console.log(data);
    //     $ionicLoading.hide();
    // });


    $scope.change = function(value) {
        if($scope.checked.length ==  0){
            console.log('its there');
            $scope.checked.push(value.Bulkwize.id);
        }else{
            console.log('its not tere');
            for(var i=0; i< $scope.checked.length; i++){
                if($scope.checked[i] == value.Bulkwize.id){
                    console.log('its coming');
                    $scope.checked.splice(i, 1);
                }else{
                    $scope.checked.push(value.Bulkwize.id);
                    break;
                }
            }
            console.log($scope.checked.length);
        }
       
       console.log($scope.checked);
    };

    $scope.addCart = function(list, count){
        console.log(list, count);
    }

});