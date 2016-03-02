angular.module('starter.controllers', [])

.directive('owlSlider', function ($ionicSideMenuDelegate) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            $ionicSideMenuDelegate.canDragContent(false);
            var options = scope.$eval($(element).attr('data-options'));
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

.controller('HomeCtrl', function($scope, $stateParams, $http) {

    $scope.dummyImage = [
        { image: 'http://db-hospitality.com/images/restaurant.jpeg'},
        { image: 'http://www.makeupandbeautyblog.com/wp-content/uploads/2015/11/aveda-shampure-dry-shampoo-2.jpg'},
        { image: 'http://www.perkinsusa.com/wp-content/uploads/2013/06/shutterstock_21820732.jpg'}
    ];

    // $http({
    //     method: 'GET',
    //     url: 'http://localhost/mobile/www/js/dummy.json'
    // }).then(function successCallback(data) {
    //     $scope.data = data.data.Dummy;
    // }, function errorCallback(data) {
    //     console.log(data)
    // });

})

.controller('CategoryListCtrl', function($scope, $stateParams, $http, $rootScope) {

    $scope.productqty = 1;
    $scope.productprice = 100;

    $scope.addProduct = function(){
        $scope.productqty  = $scope.productqty + 1;
        $scope.productprice  = $scope.productprice + 1000;
    }
    
    $scope.removeProduct = function(){
        $scope.productqty  = $scope.productqty - 1;
        $scope.productprice  = $scope.productprice - 1000;
    }

    // $scope.categoryTitle = $stateParams.cid;
    // $scope.data = [];
    // var headers = {
    //     'Access-Control-Allow-Origin' : '*',
    //     'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    // };

    $http({
        method: 'GET',
        url: 'http://52.87.231.137:8080/products'
    }).then(function successCallback(data) {
        //$scope.data = data.data.Dummy;
        $scope.data = data.data;
        console.log(data);
    }, function errorCallback(data) {
        console.log(data)
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

.controller('CartCtrl', function($scope, $rootScope, $state){
    $scope.productqty = 1;
    $scope.productprice = 100;

    $scope.addProduct = function(){
        $scope.productqty  = $scope.productqty + 1;
        $scope.productprice  = $scope.productprice + 1000;
    }
    
    $scope.removeProduct = function(){
        $scope.productqty  = $scope.productqty - 1;
        $scope.productprice  = $scope.productprice - 1000;
    }
    
    $scope.addCart = function(data){
        $state.go('app.payment');

        console.log($rootScope.cartNumber);
    }
})

.controller('SubCategoryCtrl', function($scope, $ionicTabsDelegate){

    $scope.selectTab = 1;

    $scope.init = function(selectTab) {
        $scope.selectTab = selectTab;
        console.log($scope.selectTab);
    }

    $scope.mainTab = function(setTab){
        $scope.selectTab = setTab;
        $scope.init($scope.selectTab);
        console.log($scope.selectTab);
    };
});