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

            $http.post(base_url + '/register', {'device_token': device_token})
                .success(function(response){

                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function(data){
                    deferred.reject();
                });


            return deferred.promise;

        };


        return {
            register: register
        };
    }
})();


