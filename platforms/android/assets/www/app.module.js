'use strict'; 

angular.module('nixEtherWallet',[
   'ngMaterial',
   'ngMessages', 
   'ngRoute',
   'navigator',
   'ethWallet'

]).constant('isProduction',false)
.directive('ngExcMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngExcMin, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            
            var excMinValidator = function (value) {
                var excMin = scope.$eval(attr.ngExcMin) || 0;
                if (!isEmpty(value) && value <= excMin) {
                    ctrl.$setValidity('ngExcMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngExcMin', true);
                    return value;
                }
            };

            ctrl.$parsers.push(excMinValidator);
            ctrl.$formatters.push(excMinValidator);
        }
    };
})
.directive('simpleToolbar', function () {
    return {
        templateUrl: 'simple-toolbar.directive.template.html',
        scope: {
            title: '='
        },
        controller: simpleToolbarController
    };
});

simpleToolbarController.$inject = ['home','$scope']
function simpleToolbarController(home,$scope){
    $scope.home = home; 
}

function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}