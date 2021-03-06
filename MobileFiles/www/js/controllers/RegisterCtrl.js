/**
 * Created by ghanavela on 3/12/2016 .
 */
app.controller('RegisterCtrl', function($scope, $rootScope, $ionicLoading, $http, $ionicPopup, $state,EnvConfig){

    $scope.step1 = true;
    $scope.step2 = false;
    $scope.step3 = false;
    $scope.step4 = false;

    $scope.reg = {};
	$scope.shopCity = 'Bangalore';
	$scope.shopState = 'Karnataka';

	$scope.delCity = 'Bangalore';
	$scope.delState = 'Karnataka';

	$scope.reg.shopCity = 'Bangalore';
	$scope.reg.shopState = 'Karnataka';

	$scope.reg.delCity = 'Bangalore';
	$scope.reg.delState = 'Karnataka';
	
	$scope.reg.isSameBillingAdd = true;
/*
    $scope.step1 = true;
    $scope.step2 = true;
    $scope.step3 = true;
    $scope.step4 = true;
	$scope.reg = {};
*/


    $scope.toggleItem = function(item){
        item.checked = !item.checked;
    };

    $scope.data = {
        showDelete: false
    };

    $scope.itemButtons = [
        {
            text: 'Edit',
            type: 'button-assertive',
            onTap: function(item) {
                alert('Edit Item: ' + item.id);
            }
        },
        {
            text: 'Share',
            type: 'button-calm',
            onTap: function(item) {
                alert('Share Item: ' + item.id);
            }
        }
    ];

    $scope.onItemDelete = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.items = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 }
    ];


    $scope.goNextPrev = function(step){
       for(var i=1; i <= 4; i++){
           if(i === step ){
               $scope["step"+i] = true;
           }else{
               $scope["step"+i] = false;
           }
       }
    };


    $scope.$watch('step4', function(newValue, oldValue) {

        if(newValue && $scope.reg.isSameBillingAdd ){
                $scope.reg.delAddLine1 = $scope.reg.shopAddLine1;
                $scope.reg.delAddLine2 = $scope.reg.shopAddLine2;
                $scope.reg.delCity = $scope.reg.shopCity;
                $scope.reg.delState = $scope.reg.shopState;
                $scope.reg.delPincode = $scope.reg.shopPincode;
        }else{
            $scope.reg.delAddLine1 = "";
            $scope.reg.delAddLine2 = "";
            $scope.reg.delPincode = "";

        }

    });



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
                method: 'POST',
                url: EnvConfig.HOST+'user/',
                data: regPayload
            }).then(function successCallback(response) {
                console.log(response.data.data.cas);
                if(response.data.data.cas){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Thank you for registering with us'
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
