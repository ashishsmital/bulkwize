/**
 * Created by ghanavela on 3/13/2016.
 */
app.controller('UserDetailsCtrl', function($scope, $rootScope, $ionicLoading, $http, $ionicPopup,
                                           $state,$stateParams,$window,$timeout, $ionicNavBarDelegate,$ionicSideMenuDelegate,
                                           $ionicHistory,AuthServices){


    AuthServices.getUserDetailsById($stateParams.id.split("::")[1]).then(function(data){
        $scope.userDetails = data;
        console.log($scope.userDetails);
    });





});
