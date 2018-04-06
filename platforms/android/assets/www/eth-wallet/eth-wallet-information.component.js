'use strict';

angular
.module('ethWalletInformation')
.component('ethWalletInformation', {
   templateUrl: 'eth-wallet/eth-wallet-information.template.html',
   controller : [ '$mdToast', '$mdDialog', '$scope', 'currentWallet', 'rates', 'blockExplorer',
      'sendPrompt', '$location',
      function($mdToast, $mdDialog, $scope, currentWallet, rates, blockExplorer, sendPrompt, $location) {

         $scope.refresh = refresh; 
         $scope.wallet = currentWallet.getCurrentWallet(); 
         $scope.sendEth = sendEth; 
         $scope.rates = rates.rates;

         console.log($scope.wallet); 

         recur();
         function recur(){
            setTimeout(function() {
               refresh()
               .then(recur)
            }, 5000);
         }

         function refresh(){
            return refreshEthBalance()
         }


         function refreshEthBalance(){
            return blockExplorer.getEthBalance($scope.wallet.address)
            .then(function(balance){
               console.log('balance',balance);
               $scope.balance = balance; 
            })
         }

         function sendEth(){
            $location.path('/send-coins')
         }
         

      }
]});