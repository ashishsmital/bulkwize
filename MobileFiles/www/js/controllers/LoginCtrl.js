/**
 * Created by ghanavela on 3/13/2016.
 */
app.controller('LoginCtrl', function($scope, $rootScope, $ionicLoading, $http, $ionicPopup, $state){


    $scope.submit = function(valid, value){
        console.log(valid, value)
        if(valid){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $http({
                method: 'POST',
                url: 'http://52.73.228.44:8080/login',
                data:
                {
                    "username":value.mob,
                    "password":value.password,

                },
            }).then(function successCallback(response) {
                console.log(response.data.message);
                if(response.data.message){
                    $state.go('app.home');
                }
                $ionicLoading.hide();
            }, function errorCallback(data) {
                console.log(data);
                $ionicLoading.hide();
            });
        }

    }

});
