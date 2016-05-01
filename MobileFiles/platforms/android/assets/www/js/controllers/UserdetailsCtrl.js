/**
 * Created by ghanavela on 3/13/2016.
 */
app.controller('UserDetailsCtrl', function($scope, $rootScope, $ionicLoading, $http, $ionicPopup,
                                           $state,$stateParams,$window,$timeout, $ionicNavBarDelegate,$ionicSideMenuDelegate,
                                           $ionicHistory,AuthServices,EnvConfig){




    $scope.step1 = true;
    $scope.step2 = false;
    $scope.step3 = false;
    $scope.step4 = false;

    $scope.reg = {};
    $scope.reg.shopCity = 'Bangalore';
    $scope.reg.shopState = 'Karnataka';

    $scope.reg.delCity = 'Bangalore';
    $scope.reg.delState = 'Karnataka';

    /*
     $scope.step1 = true;
     $scope.step2 = true;
     $scope.step3 = true;
     $scope.step4 = true;
     */


    $scope.reg = {};

    $scope.goNextPrev = function(step){
        for(var i=1; i <= 4; i++){
            if(i === step ){
                $scope["step"+i] = true;
            }else{
                $scope["step"+i] = false;
            }
        }
    };





    AuthServices.getUserDetailsById($stateParams.id.split("::")[1]).then(function(data){
        $scope.userDetails = data;
        if($scope.userDetails){
            $scope.reg.companyname = $scope.userDetails.shopName;
            $scope.reg.mob =  $scope.userDetails.mobileNumber;
            $scope.reg.password = $scope.userDetails.password;
            $scope.reg.confirmpassword = $scope.userDetails.password;
            $scope.reg.firstname = $scope.userDetails.firstName;
            $scope.reg.lastname = $scope.userDetails.lastName;
            $scope.reg.panumber = $scope.userDetails.pan;
            $scope.reg.email = $scope.userDetails.email;
        }


        if($scope.userDetails && $scope.userDetails.shopAddress){
            $scope.reg.shopAddLine1 = $scope.userDetails.shopAddress.addressLine1 ;
            $scope.reg.shopAddLine2 = $scope.userDetails.shopAddress.addressLine2;
            $scope.reg.shopCity = $scope.userDetails.shopAddress.city;
            $scope.reg.shopState = $scope.userDetails.shopAddress.state;
            $scope.reg.shopPincode = $scope.userDetails.shopAddress.pincode;

        }

        if($scope.userDetails && $scope.userDetails.deliveryAddress){
             $scope.reg.delshopAddLine1 = $scope.userDetails.deliveryAddress.addressLine1;
             $scope.reg.delshopAddLine2 = $scope.userDetails.deliveryAddress.addressLine1;
             $scope.reg.delshopCity = $scope.userDetails.deliveryAddress.city;
             $scope.reg.delshopState =  $scope.userDetails.deliveryAddress.state;
             $scope.reg.delshopPincode = $scope.userDetails.deliveryAddress.pincode;
        }


        //$scope.reg.companyname = ;
        console.log($scope.userDetails);

        $scope.submit = function(valid, value){
            console.log(value);
            if(valid){
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

                var regPayload = {
                    "mobileNumber":value.mob,
                    "shopName":value.companyname,
                    "password":value.password,
                    "firstname":value.firstname,
                    "lastname":value.lastname,
                    /*"pan":value.panumber,*/
                    "email":value.email,
                    "vatLicense":value.vatLicense,
                    "stptLicense":value.stptLicense,
                    "selLicense":value.selLicense,
                    "tradeLicense":value.tradeLicense,
                    "hawkerLicense":value.hawkerLicense,
                    "shopAddress":{
                        "addressLine1":value.shopAddLine1,
                        "addressLine2": value.shopAddLine2,
                        "city":value.shopCity,
                        "state":value.shopState,
                        "pincode":value.shopPincode
                    },
                    "deliveryAddress":{
                        "addressLine1":value.delAddLine1,
                        "addressLine2":value.delAddLine2,
                        "city":value.delCity,
                        "state":value.delState,
                        "pincode":value.delPincode
                    },
                    "type":"com.bulkwise.User",
                    "id":"com.bulkwise.User::"+value.mob

                };
                $scope.payLoad = regPayload;
                // console.log(JSON.stringify(regPayload));
                $http({
                    method: 'PUT',
                    url: EnvConfig.HOST+'user/',
                    data: regPayload
                }).then(function successCallback(response) {
                    console.log(response.data.data.cas);
                    if(response.data.data.cas){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Info',
                            template: 'Thank you for updating with us'
                        });

                        alertPopup.then(function(res) {
                            console.log(res);
                            if(res == true){
                                $state.go('app.login');
                            }
                        });
                    }
                    $ionicLoading.hide();
                }, function errorCallback(data) {
                    console.log(data);
                    $ionicLoading.hide();
                });
            }

        }




    });
});
