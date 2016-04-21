/**
 * Created by ghanavela on 3/12/2016.
 */

app.controller('BrandListCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state , EnvConfig){
    $ionicLoading.show();
    $scope.envHost = EnvConfig.HOST.substring(0, EnvConfig.HOST.length - 1);
    $http({
        method: 'GET',
        url: EnvConfig.HOST+'products/topdiscounts/all'
    }).then(function successCallback(data) {
        $scope.brands =  _.chunk(data.data.data , 2);
        console.log($scope.brands);
        $ionicLoading.hide();

     }, function errorCallback(data) {
        console.log(data);
        $ionicLoading.hide();
    });

});