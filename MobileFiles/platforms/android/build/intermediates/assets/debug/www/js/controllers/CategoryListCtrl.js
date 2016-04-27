/**
 * Created by ghanavela on 3/20/2016.
 */

app.controller('CategoryListCtrl', function($scope, $stateParams, $http, $rootScope, $ionicLoading, EnvConfig) {


    $scope.categoryName = $stateParams['name'];
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
	

	console.log("nitesh is"+$scope.envHost);

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

});
