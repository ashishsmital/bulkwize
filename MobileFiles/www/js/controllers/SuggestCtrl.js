app.controller('SuggestCtrl',function($scope, $rootScope, $ionicLoading, $http, $ionicPopup, $state,EnvConfig){
  $scope.submit = function(valid, value){
      console.log("inside suggest control");
      console.log(valid, value);
      if(valid){
          $scope.productName = value.productName;
          $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
          });

          $http({
              method: 'POST',
              url: EnvConfig.HOST+'products/suggest',
              data:
              {
                  "productName":value.productName,
              },
          }).then(function successCallback(response) {
              console.log(response.data.message);
              if(response.data.message){
                var alertPopup = $ionicPopup.alert({
                    title: 'Info',
                    template: 'Thanks for your suggestion, we will get back as soon as the product is added.'
                });

              }
              alertPopup.then(function(res) {
                $state.go('app.home');
              });
              $ionicLoading.hide();
          }, function errorCallback(data) {
            console.log(data);
            $ionicLoading.hide();
          });
      }

  }

});
