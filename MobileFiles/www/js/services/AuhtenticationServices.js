/**
 * Created by ghanavela on 3/13/2016.
 */
app.factory('AuthServices', function ($http,$q, $ionicPopup , $state, EnvConfig) {
    var USER_DETAILS = "USER-DETAILS";
    var AuthServices = {
        isLogin :   JSON.parse(localStorage.getItem("isLogin")) || false,
        authInfo: {
            isLogin : "" || false
        },
        getUserDetails: function(){
            return  JSON.parse(localStorage.getItem(USER_DETAILS) ||  '[]');
        },
        getUserDetailsById: function(id){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({
                method: 'GET',
                url: EnvConfig.HOST+'user/'+id
            }).then(function successCallback(data) {
                console.log(data.data);
                localStorage.setItem("isLogin",true);
                localStorage.setItem(USER_DETAILS,JSON.stringify(data.data.data[0].Bulkwize));
                deferred.resolve(data.data.data[0].Bulkwize);

            },function errorCallback(data) {
                console.log(data);
                localStorage.setItem("isLogin",false);
                localStorage.setItem(USER_DETAILS,'[]');
                deferred.reject(data);
				if(data.status == 401){
					var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Ooops! Please login '
                    });
					
					alertPopup.then(function(res) {
                        console.log("The user is not logged in and hence needs to be redirected to login page." + res);
                        if(res == true){
                            $state.go('app.login');
                        }
                    });

				}
            });
            return promise;
        },

        isMobileExist: function( mobNo ){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({
                method: 'GET',
                url: EnvConfig.HOST+'user/checkMobileNumber/'+mobNo
            }).then(function successCallback(data) {

                if(data.data.data[0]){

                    //send otp for the entered mobile number
                    $http({
                        method: 'POST',
                        url: EnvConfig.HOST+'sms2factor/sendOTP/',
                        data: {'phonenumber':mobNo}
                    }).then(function successCallback(data) {
                        deferred.resolve(false);
                    },function errorCallback(data) {
                        deferred.resolve(true);
                    });


                }else{
                    deferred.resolve(true);
                }
            },function errorCallback(data) {
                deferred.resolve(true);
            });
            return promise;

        },

        //checking if the user entered OTP is valid
        isOTPValid: function( otpValue ){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({
                method: 'GET',
                url: EnvConfig.HOST+'sms2factor/verifyOTP/'+otpValue
            }).then(function successCallback(data) {

                if(data.message=='Success'){
                    deferred.reject(false);
                }else{
                    deferred.resolve(true);
                }

            },function errorCallback(data) {
                deferred.resolve(true);
            });
            return promise;
        },




        put: function(user){
            return localStorage.setItem(USER_DETAILS,JSON.stringify(user));
        }

    }
    return AuthServices;
})
