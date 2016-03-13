/**
 * Created by ghanavela on 3/12/2016.
 */

app.controller('FaqCtrl', function($scope, $stateParams, $http, $ionicLoading, $rootScope, $state){
    $ionicLoading.show();
    $http({
        method: 'GET',
        url: 'json/faqs.json'
    }).then(function successCallback(data) {
        $scope.faqs  = data.data;
        $ionicLoading.hide();
    }, function errorCallback(data) {
        $ionicLoading.hide();
    });
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

})