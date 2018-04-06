'use strict';

angular
.module('ethWallet')
.factory('sendPrompt', sendPrompt)

sendPrompt.$inject = ['$mdDialog']; 

function sendPrompt($mdDialog) {
   
   return prompt

   function prompt(){

      return $mdDialog.show({
         controller: controller,
         templateUrl: 'eth-wallet/send-prompt.dialog.template.html',
         clickOutsideToClose:false,
         fullscreen: true
      })
      .then(function(res) {
         return res 
      }, function() {

      });

   }

   controller.$inject = ['$scope','$mdDialog']; 
   function controller($scope,$mdDialog){
      
      $scope.send = function(data){
         $mdDialog.hide(data); 
      }

      $scope.cancel = function(){
         $mdDialog.cancel()
      }
   }

}