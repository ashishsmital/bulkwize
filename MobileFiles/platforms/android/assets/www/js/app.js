// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var pushNotification;
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngMessages'])

.run(function($ionicPlatform,$rootScope,$location, $window,RequestsService) {
  $ionicPlatform.ready(function() {
	  
	  // initialise google analytics

		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-75906058-2', "auto");
		  //ga('send', 'pageview');


//        $window.ga('create', 'UA-75906058-2', 'bulkwize.com');
 
        // track pageview on state change
        $rootScope.$on('$stateChangeSuccess', function (event) {
			if (!$window.ga)
                    return;
            $window.ga('send', 'pageview', { page: $location.path() });
        });
		
		// end Google Analytics
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

      /*
      var push = new Ionic.Push({
          "debug": true
      });

     push.register(function(token){
         //debugger;
         console.log("device token",token.token);
     });
       */
      if (window.cordova ){
          pushNotification = window.plugins.pushNotification;
          alert(pushNotification);
          pushNotification.register(
              onNotification,
              errorHandler,
              {
                  'badge': 'true',
                  'sound': 'true',
                  'alert': 'true',
                  'ecb': 'onNotification',
                  //'senderID': 'YOUR GOOGLE CONSOLE PROJECT NUMBER',
                  'senderID': 'AIzaSyBoIsr7M2vjb_2w5lL8hFi0Z9qwXqClxcI',
              }
          );
      }



  });
})
.config(['$httpProvider',function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials  = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
 }]) 

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: '/search/:searchId',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
    })

    .state('app.login', {
        url:"/login",
        views:{
            'menuContent':{
                templateUrl:'templates/login.html',
                controller: "LoginCtrl"
            }
        }
    })

    .state('app.register', {
        url:"/register",
        views:{
            'menuContent':{
                templateUrl:'templates/register.html',
                controller: 'RegisterCtrl'
            }
        }
    })

    .state('app.supplier', {
        url:"/supplier",
        views:{
            'menuContent':{
                templateUrl:'templates/supplier.html',
                controller: 'SupplierCtrl'
            }
        }
    })

    .state('app.forgotpassword', {
        url:"/forgotpassword",
        views:{
            'menuContent':{
                templateUrl:'templates/forgotpassword.html',
                controller: 'ForgotPasswordCtrl'
            }
        }
    })
    .state('app.home', {
		cache: false,
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('app.aboutus', {
        url: '/aboutus',
        views: {
            'menuContent': {
                templateUrl: 'templates/aboutus.html'
            }
        }
    })
      .state('app.userDetails', {
          url: '/userDetails/:id',
          views: {
              'menuContent': {
                  templateUrl: 'templates/userdetails.html',
                  controller: 'UserDetailsCtrl'
              }
          }
      })
  .state('app.myOrders', {
          url: '/myOrders/',
          views: {
              'menuContent': {
                  templateUrl: 'templates/myOrders.html',
                  controller: 'MyOrdersCtrl'
              }
          }
  })

    .state('app.faq', {
        url: '/faq',
        views: {
            'menuContent': {
                templateUrl: 'templates/faq.html',
                controller: 'FaqCtrl'
            }
        }
    })

    .state('app.categorylist',{
        url:'/categorylist/:name',
        views:{
            'menuContent' : {
                templateUrl: 'templates/categorylist.html',
                controller: 'CategoryListCtrl'
            }
        }
    })

    .state('app.brand',{
        url:'/brand',
        views:{
            'menuContent' : {
                templateUrl: 'templates/brand.html',
                controller: 'BrandListCtrl'

            }
        }
    })

    .state('app.category',{
        url:'/category',
        views:{
            'menuContent' : {
                templateUrl: 'templates/category.html'
            }
        }
    })

    .state('app.subcatbrand',{
        url:'/subcatbrand/:subId/:productName',
        views:{
            'menuContent' : {
                templateUrl: 'templates/subcatbrand.html',
                controller: 'SubCategoryBrandCtrl'
            }
        }
    })

    .state('app.subcategory',{
        url:'/subcategory/:prodname',
        views:{
            'menuContent' : {
                templateUrl: 'templates/subcategory.html',
                controller: 'SubCategoryCtrl'
            }
        }
    })

    .state('app.categorydetail', {
        url: '/categorydetail/:pId',
        views: {
            'menuContent': {
                templateUrl: 'templates/categorydetail.html',
                controller: 'CategoryDetailCtrl'
            }
        }
    })

    .state('app.cart', {
        url: '/cart',
        views: {
            'menuContent': {
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
            }
        }
    })

    .state('app.shipping', {
        url: '/shipping',
        views: {
            'menuContent': {
                templateUrl: 'templates/shipping.html',
                controller: 'ShippingCtrl'
            }
        }
    })

    .state('app.confirm', {
        url: '/confirm',
        views: {
            'menuContent': {
                templateUrl: 'templates/confirm.html',
                controller: 'ConfirmCtrl'
            }
        }
    })

    .state('app.success', {
        url: '/success',
        views: {
            'menuContent': {
                templateUrl: 'templates/success.html'
            }
        }
    })

    .state('app.payment', {
        url: '/payment',
        views: {
            'menuContent': {
                templateUrl: 'templates/payment.html'
            }
        }
    });
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});

window.onNotification = function(e){

    switch(e.event){
        case 'registered':
            if(e.regid.length > 0){

                var device_token = e.regid;
                RequestsService.register(device_token).then(function(response){
                    alert('registered!');
                });
            }
            break;

        case 'message':
            alert('msg received: ' + e.message);
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
            alert('error occured');
            break;

    }
};

window.errorHandler = function(error){
    alert('an error occured');
}