/**
 * Created by ghanavela on 3/12/2016.
 */

app.controller('BrandListCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state , EnvConfig){
    $ionicLoading.show();
    $http({
        method: 'GET',
        url: EnvConfig.HOST+'produtcs/topdiscounts/all'
    }).then(function successCallback(data) {
        console.log(data);
        debugger;
     }, function errorCallback(data) {
        console.log(data);
        debugger;
        $ionicLoading.hide();
    });

});