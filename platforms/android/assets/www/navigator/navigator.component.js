'use strict';

angular
.module('navigator')
.component('navigator', {
  templateUrl: 'navigator/navigator.template.html',
  controller : [ '$mdToast', '$mdDialog', '$scope', '$mdSidenav',
    '$location', 'blockExplorer', 'currentWallet', 'rates',
    function($mdToast, $mdDialog, $scope, $mdSidenav, $location, blockExplorer, currentWallet,rates) {

      if (currentWallet.isWalletInLocalStorage()){
        currentWallet.recoverWalletFromLocalStorage()
        .then(function(){
          rates.start(); 
          $location.path('/eth-wallet-information');  
        }) 
      } else {
        $location.path('/eth-wallet-setup'); 
      }

      $scope.button = "menu"

      $scope.menu = [
        {icon: "compare_arrows", name: "Transaction History", path:"/view-transactions"},
        {icon: "account_balance_wallet", name: 'Backup Wallet'},
        // {icon: "delete", name: "Clear Wallet"},
        // {icon: "lock", name: "Change Pin"},
        // {icon: "help", name: "Help"},
        // {icon: "info", name: "About nix"}
      ]

      $scope.showMenu = function(){

        if ($location.path() == "/eth-wallet-information"){
          return true
        } else {
          return false 
        }

      }

      $scope.navigateTo = function(item){
        $location.path(item.path); 
        $mdSidenav('left').toggle(); 
      }

      $scope.toggle = function(){
        $mdSidenav('left').toggle()
      }


    }
]})
.factory('home',['$location',function($location){

  return function(){
    $location.path('/eth-wallet-information')
  }

}])
