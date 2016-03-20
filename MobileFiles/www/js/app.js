// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngMessages'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
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
                templateUrl:'templates/forgotpassword.html'
            }
        }
    })

    .state('app.home', {
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
        url:'/categorylist',
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
                templateUrl: 'templates/brand.html'
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