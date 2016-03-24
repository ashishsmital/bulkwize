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
        $scope.reg.companyname = $scope.userDetails.shopName;
        $scope.reg.mob =  $scope.userDetails.mobileNumber;
        $scope.reg.password = $scope.userDetails.password;
        $scope.reg.confirmpassword = $scope.userDetails.password;
        $scope.reg.firstname = $scope.userDetails.firstName;
        $scope.reg.lastname = $scope.userDetails.lastName;
        $scope.reg.panumber = $scope.userDetails.pan;
        $scope.reg.email = $scope.userDetails.email;

        //$scope.reg.companyname = ;
        console.log($scope.userDetails);
    });





});
