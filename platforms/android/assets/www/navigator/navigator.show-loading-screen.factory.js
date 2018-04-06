'use strict';

angular
.module('navigator')
.factory('showLoadingScreen',['$mdDialog',function($mdDialog){

   return function(){
         $mdDialog.show({
            templateUrl: 'navigator/navigator.loading-screen.template.html',
            clickOutsideToClose:false,
            fullscreen: true
         })
         .then(function(answer) {
            
         },function() {
            
         });
      }
}])