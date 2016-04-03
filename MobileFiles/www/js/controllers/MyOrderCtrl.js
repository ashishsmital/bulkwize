/**
 * Created by ghanavela on 3/12/2016.
 */

app.controller('MyOrdersCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state , EnvConfig){
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
        $ionicLoading.hide();
    });

});