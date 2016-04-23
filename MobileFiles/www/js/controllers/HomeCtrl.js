/**
 * Created by ghanavela on 3/19/2016.
 */

app.controller('HomeCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $ionicSlideBoxDelegate,$ionicHistory, $ionicNavBarDelegate, $state, EnvConfig) {
	console.log(JSON.stringify($ionicHistory.currentView()));



	$rootScope.goToHome = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: false,
		  disableBack: true
		});
		$state.go('app.home');
	}

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    $scope.envHost = EnvConfig.HOST.substring(0, EnvConfig.HOST.length - 1);

    $scope.category = [];
    $http({
        method: 'GET',
        url: EnvConfig.HOST+'category'
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


    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });


    $http({
        method: 'GET',
        url: EnvConfig.HOST+'products/topdiscounts/10'
    }).then(function successCallback(data) {

       $scope.productLists = _.chunk(data.data.data, 3);
       $scope.isProduct = true;
     }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });



    $http({
        method: 'GET',
        url: EnvConfig.HOST+'promotion/carousel'
    }).then(function successCallback(data) {
        console.log(data.data.carouselURLs);

        $scope.promotionImage = data.data.carouselURLs;
        $ionicSlideBoxDelegate.update();
        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

	$http({
        method: 'GET',
        url: EnvConfig.HOST+'shoppingcart/'
    }).then(function successCallback(data) {
        //console.log(data.data.data[0].Bulkwize.updatedAt);
        if(data.data.data.length > 0){
            $scope.cartDetails = data.data.data[0].Bulkwize;
			$rootScope.cartNumber = data.data.data[0].Bulkwize.totalCount;
        }else{
            $rootScope.cartNumber = 0;
            $scope.cartDetails = [];
        }

        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

    console.log($rootScope.cartNumber);
	
});
