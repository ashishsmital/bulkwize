/**
 * Created by ghanavela on 4/3/2016.
 */
app.directive('owlSlider', function ($ionicSideMenuDelegate) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            $ionicSideMenuDelegate.canDragContent(false);
            scope.initCarousel = function(element) {
                $(element).owlCarousel({
                    autoPlay: false,
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    items: 3,
                    itemsDesktop: [1199, 3],
                    itemsDesktopSmall: [979, 3],
                    itemsTablet: [600, 3],
                    itemsMobile: false
                });
            };
        }
    };
})

    .directive('owlCarouselItem', function() {
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element) {
                // wait for the last item in the ng-repeat then call init
                if(scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
    })
    .directive('mobileExist', function ( AuthServices, $q) {
        return {
            restrict: 'A',
            require: ['ngModel', '^form'],
            scope: true,
            link: function (scope, element, attributes, ctrls) {

                var ngModel = ctrls[0];
                var form = ctrls[1];
                ngModel.$asyncValidators.checkMob = function (modelValue, viewValue) {
                    return $q(function (resolve, reject) {
                    AuthServices.isMobileExist(modelValue).then(function () {
                      resolve();
                    }, function () {
                       reject();
                    });

                    });
                };
            }
        }
    }).directive('compareTo', function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    });
