// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

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
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
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
        url:'/brand',
        views:{
            'menuContent' : {
                templateUrl: 'templates/category.html'
            }
        }
    })

    .state('app.subcategory',{
        url:'/subcategory',
        views:{
            'menuContent' : {
                templateUrl: 'templates/subcategory.html',
                controller: 'SubCategoryCtrl'
            }
        }
    })

    .state('app.categorydetail', {
        url: '/categorydetail',
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
