/**
 * Created by ghanavela on 3/12/2016.
 */

app.controller('MyOrdersCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state ,AuthServices, EnvConfig){
    $ionicLoading.show();
    $scope.isMyOrders = false;
    $scope.toggleGroup = function(group) {
        console.log(group);
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };

    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    $scope.envHost = EnvConfig.HOST.substring(0, EnvConfig.HOST.length - 1);

    $http({
        method: 'GET',
        url: EnvConfig.HOST+'order'
    }).then(function successCallback(data) {
        console.log(data);

        if(data.data.data){
            $scope.isMyOrders = true;
            $scope.myOrders = data.data.data;
        }

        /*
        if(data.data.products && data.data.products.length > 0 ){
            $scope.isMyOrders = true;
            $scope.myOrders = data.data.products;
        }
        */

        $ionicLoading.hide();
    }, function errorCallback(data) {
        console.log(data);
        $scope.isMyOrders = false;
		if(data.status == 401){
					var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Ooops! Please login '
                    });

					alertPopup.then(function(res) {
                        console.log("The user is not logged in and hence needs to be redirected to login page." + res);
                        if(res == true){
                            $rootScope.isLogin = AuthServices.isLogin = false;
                            $rootScope.userDetails = [];
                            localStorage.setItem("isLogin",false);
                            localStorage.setItem("USER-DETAILS",'[]');
                            $state.go('app.login');
                        }
                    });

		}
        $ionicLoading.hide();
    });

});
