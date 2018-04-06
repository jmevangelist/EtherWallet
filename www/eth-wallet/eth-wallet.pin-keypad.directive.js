'use strict';

angular
.module('ethWallet')
.directive('pinKeypad', [function() {
   
   var controller = ['$scope',function($scope){

   }]

   return {
      templateUrl: 'eth-wallet/eth-wallet.pin-keypad.template.html',
      controller: controller,
      scope: {
         pin: '='
      },
   }


}])