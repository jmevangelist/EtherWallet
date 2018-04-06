'use strict';

angular
.module('ethWallet')
.factory('showPinInterface',['$mdDialog','$q',function ($mdDialog,$q) {
   

   return function(type,validation){

      var q = $q.defer(); 

      var controller = ['$scope','$mdToast',function($scope,$mdToast){

         $scope.pin = [];
         $scope.instruction = "Please enter your pin"; 
         $scope.warning = "Please don't forget your pin. There's no way to retrieve it if you do."

         var firstPin = ""; 
         var tries = 0; 

         type = type || 'setup'; 
         $scope.type = type; 

         if(type == 'setup'){ // return the key

         } else if (type == 'check'){ // one time check, reference current keystore for validation 

         }

         var showIncorrectToast = function(){
            $mdToast.show(
                  $mdToast.simple()
                    .textContent('Incorrect pin')
               );
         }

         $scope.$watch('pin',function(currentPin){
            if (currentPin.length == 4){

               if (type == 'setup'){

                  if ($scope.instruction == "ENTER PIN"){
                     firstPin = $scope.pin.join(''); 
                     $scope.pin = []; 
                     $scope.instruction = "CONFIRM PIN"
                  } else {

                     if (firstPin == $scope.pin.join('')){
                        $mdDialog.hide(firstPin)
                     } else {
                        $scope.pin = []; 
                        showIncorrectToast()
                     }
                  }

               } else {

                  var pinString = $scope.pin.join('');
                  
                  validation(pinString).then(function(valid){
                     if (valid){
                        console.log(valid); 
                        $mdDialog.hide(pinString); 
                     } else {
                        $scope.pin = []; 
                        showIncorrectToast(); 
                     }
                  })

               }

            }
         },true)


      }]

      $mdDialog.show({
         controller: controller,
         templateUrl: 'eth-wallet/eth-wallet.setup-pin.template.html',
         clickOutsideToClose:false,
         fullscreen: true
      }).then(function(answer){
         console.log('dialog closed',answer); 
         q.resolve(answer);
      },function(){

      })

      return q.promise 

   }

}])
