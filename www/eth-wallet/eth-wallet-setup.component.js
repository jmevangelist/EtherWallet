'use strict';

angular
.module('ethWalletSetup',[])
.component('ethWalletSetup', {
   templateUrl: 'eth-wallet/eth-wallet-setup.template.html',
   controller : [ '$mdToast', '$mdDialog', '$scope', 'currentWallet', '$location', 'rates',
      function($mdToast, $mdDialog, $scope, currentWallet, $location, rates) {

         $scope.title = [
            "End User Agreement",
            "Create Wallet",
            "Backup Phrase",
            "Verify Backup Copy",
            "Setup Security Pin",
            "Setup Security Pin" ];

         $scope.step = 0; 
         $scope.pin = [];
         $scope.confirmationPin = []; 
         $scope.seed = undefined; 

         var generateSeed = function(){
            $scope.seed = lightwallet.keystore.generateRandomSeed();
            console.log($scope.seed); 
         }


         $scope.back = function(){
            $scope.step--; 
         }

         $scope.continue = function(){ 

            switch ($scope.step){
               case 1:
                  if ($scope.type == 'new'){
                     $scope.step++
                     generateSeed();
                  } else {
                     if (lightwallet.keystore.isSeedValid($scope.seed)){
                        $scope.step = 4;                         
                     } else {
                        $mdToast.show(
                           $mdToast.simple()
                             .textContent('Invalid Backup Phrase (Seed)')
                        );      
                     }

                  }
                  break;

               case 5:

                  currentWallet.initializeWallet({seed: $scope.seed, password: $scope.pin.slice(0,4).join('')})
                  .then(function(){
                     currentWallet.getCurrentWallet().saveToLocalStorage(); 
                     $location.path('/eth-wallet-information')
                     rates.start(); 
                  })

               default:
                  $scope.step++

            }

         }

         $scope.disableContinue = function(){

            var disabled = true; 

            switch ($scope.step){
               case 0:
                  disabled = false;
                  break;
               case 1:
                  if ($scope.type == 'new' || ($scope.type == 'restore' && $scope.seed)){
                     disabled = false; 
                  }
                  break;
               case 2:
                  disabled = false;
                  break;
               case 3:
                  if ($scope.verificationSeed == $scope.seed){
                     disabled = false;
                  }
                  break;
               case 4:
                  if ($scope.pin.length > 3){
                     disabled = false; 
                  }
                  break;
               case 5:
                  if ($scope.pin.slice(0,4).join('') == $scope.confirmationPin.slice(0,4).join('') ){
                     disabled = false; 
                  }
                  break;
            }

            return disabled; 

         }

         $scope.$watch('confirmationPin',function(value){

            if(value.length == 4){
               if ($scope.pin.slice(0,4).join('') != value.slice(0,4).join('')){
                  $mdToast.show(
                     $mdToast.simple()
                       .textContent('Incorrect pin')
                  );
                  $scope.confirmationPin = [];      
               }
            }

         },true)


      }
]});