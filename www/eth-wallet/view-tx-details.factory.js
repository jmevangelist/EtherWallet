'use strict';

angular
.module('ethWallet')
.factory('viewTxDetails', viewTxDetails)

viewTxDetails.$inject = ['$mdDialog','$mdMedia']; 

function viewTxDetails($mdDialog,$mdMedia) {
   
   return prompt

   function prompt(tx){

      return $mdDialog.show({
         controller: controller,
         templateUrl: 'eth-wallet/view-tx-details.dialog.template.html',
         clickOutsideToClose:true,
         fullscreen: !$mdMedia('gt-sm')
      })

      controller.$inject = ['$scope','$mdDialog']; 
      function controller($scope,$mdDialog){
         $scope.tx = tx; 
         $scope.url = "https://ropsten.etherscan.io/tx/" + tx.hash; 
         $scope.cancel = function(){   $mdDialog.hide()  }; 
      }

   }

}