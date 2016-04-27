/**
 * Created by ghanavela on 3/23/2016.
 */

(function(){


    app.service('RequestsService', ['$http', '$q', '$ionicLoading', 'EnvConfig', RequestsService]);

    function RequestsService($http, $q, $ionicLoading,EnvConfig){

        var base_url = EnvConfig.host;
        //debugger;
        function register(device_token){

            var deferred = $q.defer();
            $ionicLoading.show();

            $http.post(base_url + 'promotion/register', {'deviceToken': device_token})
                .success(function(response){
                   alert("Push alert suceess");
                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function(data){
                    alert("Push alert fail");
                    deferred.reject();
                });


            return deferred.promise;

        };


        return {
            register: register
        };
    }
})();


