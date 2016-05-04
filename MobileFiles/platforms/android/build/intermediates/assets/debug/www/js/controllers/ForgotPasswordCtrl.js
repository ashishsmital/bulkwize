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
        }else if(value.vat === $scope.stptLicense){
			$scope.step3 = true;
		}else if(value.vat === $scope.selLicense){
			$scope.step3 = true;
		}else if(value.vat === $scope.tradeLicense){
			$scope.step3 = true;
		}else if(value.vat === $scope.hawkerLicense){
			$scope.step3 = true;
		}else{
            var alertPopup = $ionicPopup.alert({
                title: 'Info',
                template: 'Please enter the license no. same as entered during registration. For any assistance please contact customer care!'
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


    $scope.goNextPrev = function(step){
        for(var i=1; i <= 4; i++){
            if(i === step ){
                $scope["step"+i] = true;
            }else{
                $scope["step"+i] = false;
            }
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

                if(!response.data.data[0]){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'The mobile number does not exist, Please check the mobile number'
                    });

                }

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
					if(response.data.data[0].Bulkwize.selLicense) {
                        $scope.selLicense = response.data.data[0].Bulkwize.selLicense;
                    }
					if(response.data.data[0].Bulkwize.stptLicense) {
                        $scope.stptLicense = response.data.data[0].Bulkwize.stptLicense;
                    }
					if(response.data.data[0].Bulkwize.tradeLicense) {
                        $scope.tradeLicense = response.data.data[0].Bulkwize.tradeLicense;
                    }
					if(response.data.data[0].Bulkwize.hawkerLicense) {
                        $scope.hawkerLicense = response.data.data[0].Bulkwize.hawkerLicense;
                    }

                }

                $ionicLoading.hide();
            }, function errorCallback(data) {
                debugger;
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
