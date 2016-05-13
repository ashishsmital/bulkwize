/**
 * Created by ghanavela on 3/23/2016.
 */

(function(){


    app.service('RequestsService', ['$http', '$q', '$ionicLoading', 'EnvConfig', RequestsService]);

    function RequestsService($http, $q, $ionicLoading,EnvConfig){

		 document.addEventListener("deviceready", function(){
			  
		//  alert("Inside window.cordova and before initializing push notification");
          var push = PushNotification.init({ "android": {"senderID": "246022430024"},
		"ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {} } );
		
		push.on('registration', function(data) {
			//	alert("The device token is --" + data);
				//alert("The device token is --" + data.registrationId);
			 var device_token = data.registrationId;
                register(device_token).then(function(response){
                  //  alert('registered!');
				});
			
		  
		});
		
		push.on('notification', function(e) {
		  //alert(e);
		   switch(e.event){
        case 'registered':
            
            //alert('registered successfully!');
            
            break;

        case 'message':
           // alert('msg received: ' + e.message);
            /*
             {
             "message": "Hello this is a push notification",
             "payload": {
             "message": "Hello this is a push notification",
             "sound": "notification",
             "title": "New Message",
             "from": "813xxxxxxx",
             "collapse_key": "do_not_collapse",
             "foreground": true,
             "event": "message"
             }
             }
             */
            break;

        case 'error':
            //alert('error occured');
            break;

    }
		});

      
	   }, false);
	   
	   // end of addition from ashish for gcm

		
        var base_url = EnvConfig.host;
        //debugger;
        function register(device_token){
			//alert("Inside register function with device token being " + device_token);
            var deferred = $q.defer();
            
			$http({
                method: 'POST',
                url: EnvConfig.HOST+'promotion/register',
				data:{"deviceToken": device_token}
            }).then(function successCallback(response) {
              //  alert("Push alert suceess");
                    
                    deferred.resolve(response);

            },function errorCallback(response) {
                // alert("Push alert fail with response " + response);
					
                    deferred.reject();
            });
			
            

            return deferred.promise;

        };


        return true;
    }
})();


