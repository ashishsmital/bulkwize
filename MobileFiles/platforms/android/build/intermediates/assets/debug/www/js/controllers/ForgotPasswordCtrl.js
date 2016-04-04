/**
 * Created by ghanavela on 2/4/2016 .
 */
app.controller('ForgotPasswordCtrl', function($scope, $rootScope, $ionicLoading, $http, $ionicPopup, $state,EnvConfig){

    $scope.step1 = true;
    $scope.step2 = false;
    $scope.step3 = false;

    $scope.checkVat = function(valid , value){

        if(value.vat === $scope.vatLicense){
            $scope.step3 = true;
        }else{
            var alertPopup = $ionicPopup.alert({
                title: 'Info',
                template: 'Please enter valid vat no'
            });

            alertPopup.then(function(res) {
                console.log(res);
                if(res == true){
                    // $state.go('app.login');
                }
            });
        }

    };

    $scope.changePassword = function(valid , value){
        if(valid){
            var payload = {
                "mobileNumber":$scope.mobileNumber,
                "password":value.password
            };

            $http({
                method: 'PUT',
                url: EnvConfig.HOST+'user/forgotpassword/',
                data:payload

            }).then(function successCallback(response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Info',
                    template: 'Password changed successfully!!!'
                });

                alertPopup.then(function(res) {
                    console.log(res);
                    if(res == true){
                        $state.go('app.login');
                    }
                });
                $ionicLoading.hide();
            }, function errorCallback(data) {

                $ionicLoading.hide();
            });

        }
    };

    $scope.checkMob = function(valid , reg){

        if(valid){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });


            $http({
                method: 'GET',
                url: EnvConfig.HOST+'user/forgotpassword/'+reg.mob

            }).then(function successCallback(response) {

                if(response.data.data[0].Bulkwize){
                    $scope.step1 = false;
                    $scope.step2 = true;

                    if( response.data.data[0].Bulkwize.mobileNumber ){
                        $scope.mobileNumber = response.data.data[0].Bulkwize.mobileNumber;
                    }
                    if(response.data.data[0].Bulkwize.pan){
                        $scope.pan = response.data.data[0].Bulkwize.pan;
                    }
                    if(response.data.data[0].Bulkwize.vatLicense) {
                        $scope.vatLicense = response.data.data[0].Bulkwize.vatLicense;
                    }

                }

                $ionicLoading.hide();
            }, function errorCallback(data) {
                console.log(data);
                var alertPopup = $ionicPopup.alert({
                    title: 'Info',
                    template: 'Please enter valid mobile no'
                });

                alertPopup.then(function(res) {
                    console.log(res);
                    if(res == true){
                       // $state.go('app.login');
                    }
                });

                $ionicLoading.hide();
            });
        }

    }


});