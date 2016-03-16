/**
 * Created by ghanavela on 3/12/2016 .
 */
app.controller('RegisterCtrl', function($scope, $rootScope, $ionicLoading, $http, $ionicPopup, $state){
    $scope.step1 = true;
    $scope.step2 = false;
    $scope.step3 = false;
    $scope.step4 = false;

    $scope.goNextPrev = function(step){
        console.log(step);
       for(var i=1; i <= 4; i++){
           if(i === step ){
               $scope["step"+i] = true;
           }else{
               $scope["step"+i] = false;
           }
       }
    };



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

            $http({
                method: 'POST',
                url: 'http://52.73.228.44:8080/user/',
                data:
                {
                    "mobileNumber":value.mob,
                    "shopName":value.mob,
                    "firstname":value.shopname,
                    "password":value.password,
                    "lastname":value.lastname,
                    "pan":value.panumber,
                    "email":value.email,
                    "shopAddress":value.shopaddress,
                    "deliveryAddress":"1234",
                    "type":"com.bulkwise.User",
                    "id":"com.bulkwise.User::"+value.mob

                },
            }).then(function successCallback(response) {
                console.log(response.data.data.cas);
                if(response.data.data.cas){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Thanks for register with us'
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