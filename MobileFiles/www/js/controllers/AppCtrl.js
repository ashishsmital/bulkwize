/**
 * Created by ghanavela on 3/18/2016.
 */
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $http,
                                $ionicLoading,$ionicHistory,$ionicNavBarDelegate,
                                $ionicSideMenuDelegate,$state,AuthServices,EnvConfig) {


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
        url: EnvConfig.HOST+'shoppingcart/'
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

});


