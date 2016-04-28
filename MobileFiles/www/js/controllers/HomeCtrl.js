/**
 * Created by ghanavela on 3/19/2016.
 */

app.controller('HomeCtrl', function($scope, $stateParams, $http, $timeout, $ionicLoading, $rootScope, $ionicSlideBoxDelegate,$ionicHistory,
                                    $ionicNavBarDelegate, $state, EnvConfig , AuthServices) {

	console.log(JSON.stringify($ionicHistory.currentView()));
	$rootScope.goToHome = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: false,
		  disableBack: true
		});
		$state.go('app.home');
	}

    // Called each time the slide changes
    $scope.slideHasChanged = function(index) {

        $scope.slideIndex = index;
       console.log("index "+index);
    };

    $timeout(function(){
        $scope.slides = ['1','2'];
        $ionicSlideBoxDelegate.update();
    },900);



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
        $timeout(function(){
            $scope.slides = $scope.productLists;
            $ionicSlideBoxDelegate.update();
        },900);


       $scope.isProduct = true;
     }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });


    $http({
        method: 'GET',
        url: EnvConfig.HOST+'user/'
    }).then(function successCallback(data) {
        localStorage.setItem("isLogin",true);
        localStorage.setItem("USER-DETAILS",JSON.stringify(data.data.data[0].Bulkwize));
        if(data.data.data[0].Bulkwize){
            $rootScope.isLogin =  true;
            $rootScope.userDetails = AuthServices.getUserDetails();
        }else{
            $ionicHistory.clearHistory();
            $ionicNavBarDelegate.showBackButton(false);
            $rootScope.isLogin = AuthServices.isLogin = false;
            $rootScope.userDetails = [];
            localStorage.setItem("isLogin",false);
            localStorage.setItem("USER-DETAILS",'[]');
            $state.go('app.home');

        }

    }, function errorCallback(data) {
        $ionicHistory.clearHistory();
        $ionicNavBarDelegate.showBackButton(false);
        $rootScope.isLogin = AuthServices.isLogin = false;
        $rootScope.userDetails = [];
        localStorage.setItem("isLogin",false);
        localStorage.setItem("USER-DETAILS",'[]');
        $state.go('app.home');
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
