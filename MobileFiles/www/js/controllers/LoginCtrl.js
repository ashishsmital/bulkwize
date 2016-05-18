/**
 * Created by ghanavela on 3/13/2016.
 */
app.controller('LoginCtrl', function($scope, $rootScope, $ionicLoading, $http, $ionicPopup, $state,$window,$timeout,
                                     $ionicNavBarDelegate,$ionicSideMenuDelegate, $ionicHistory,AuthServices,EnvConfig){


    $scope.submit = function(valid, value){
        console.log(valid, value)
        if(valid){
            $scope.mob = value.mob;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $http({
                method: 'POST',
                url: EnvConfig.HOST+'login',
                data:
                {
                    "username":value.mob,
                    "password":value.password,

                },
            }).then(function successCallback(response) {
                console.log(response.data.message);
                if(response.data.message){

                    AuthServices.getUserDetailsById($scope.mob).then(function(data){

                        $ionicHistory.clearHistory();
                        $ionicNavBarDelegate.showBackButton(false);
                        $state.go('app.home');
                        $timeout(function() {
                            $window.location.reload();
                            $ionicLoading.hide();
                        },0);
                    });

                }

            }, function errorCallback(data) {
                console.log(data);
				if(data.status == 401){
					var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Either the username or password is incorrect.'
                    });

					

				}
                $ionicLoading.hide();
            });
        }

    }

});
