/**
 * Created by ghanavela on 3/13/2016.
 */
app.factory('AuthServices', function ($http,$q,EnvConfig) {
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
                deferred.resolve(true);

            },function errorCallback(data) {
                deferred.reject(false);
            });
            return promise;
        },



        put: function(user){
            return localStorage.setItem(USER_DETAILS,JSON.stringify(user));
        }

    }
    return AuthServices;
})
