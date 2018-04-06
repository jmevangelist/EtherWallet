'use strict';

angular
.module('ethWalletInformation')
.component('sendCoins',{
   templateUrl: 'eth-wallet/send-coins.template.html', 
   controller: sendCoins
})

sendCoins.$inject = ['$scope', 'blockExplorer', 'currentWallet','rates','$location']; 

function sendCoins($scope, blockExplorer, currentWallet, rates,$location){

   // TODO: add options: https://ethgasstation.info/json/ethgasAPI.json 
   // put gas limit and gas price in advance option 

   var wallet = currentWallet.getCurrentWallet(); 
   var txParams; 

   $scope.units = ['PHP','ETH']; 
   $scope.unit = 'ETH'; 

   $scope.amountInETH = 0; 

   $scope.send = send; 
   $scope.loading = false; 

   $scope.rates = rates.rates; 
   $scope.openScanner = openScanner; 

   init(); 

   $scope.openMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
   };


   $scope.setUnit = function(u){
      
      $scope.unit = u; 

      if (u == 'ETH'){
         $scope.amount = $scope.amountInETH;
      } else {
         $scope.amount = $scope.amountInETH*$scope.rates.ETHinPHP;
      }

   }

   $scope.updateAmount = function(){
      if ($scope.unit == 'ETH'){
         $scope.amountInETH =  $scope.amount; 
      } else {
         $scope.amountInETH = $scope.amount/$scope.rates.ETHinPHP;
      }
   }

   
   function init(){
      getTxParams()
      .then(function(res){
         txParams = res; 
         $scope.gasLimitMin = parseInt(res.estimate.gas,16)
         $scope.gasLimit = parseInt(res.estimate.gas,16)*1.5; 
         $scope.gasPrice = parseInt(res.estimate.gasPrice,16)*0.000000001; 
         var nonce = res.nonce; 
      })
   }

   
   function getAmountInETH(){
      if ($scope.unit == 'ETH'){
         return $scope.amount
      } else {
         return ($scope.amount / $scope.rates.ETHinPHP)
      }
   }

   function send(){
      $scope.loading = true; 
      txParams.value = $scope.amountInETH; 
      txParams.address = $scope.destinationAddress; 
      txParams.gasLimit = $scope.gasLimit;
      txParams.gasPrice = ( $scope.gasPrice / 0.000000001 ); 
      
      signAndSendTx(txParams).then(function(res){
         $scope.loading = false; 
         txParams.hash = res; 
         wallet.addPendingTransaction(txParams); 
         $location.path('/view-transactions')
      })
   }


   function signAndSendTx(txParams){
      
      var txOptions = {
         gasPrice: txParams.estimate.gasPrice,
         gasLimit: txParams.estimate.gas*1.5,
         value: txParams.value*1000000000000000000,
         nonce: txParams.nonce,
         to: txParams.address,
      }

      var valueTx = lightwallet.txutils.valueTx(txOptions);

      var signedValueTx = wallet.sign(valueTx);
      return blockExplorer.sendRawTransaction('0x'+signedValueTx).then(function(txHash){
         return txHash
      })  
   }


   function getTxParams(){
      var txParams = {}; 
      
      return blockExplorer.estimateGasAndGasPrice()
      .then(function(estimate){
            txParams.estimate = estimate; 
            return true; 
         })
      .then(function(){
            return blockExplorer.getTransactionCount(wallet.address)
         })
      .then(function(txCount){
            txParams.nonce = txCount; 
            return txParams; 
         })
   }

   let scanner = new Instascan.Scanner(
      { 
         video: document.getElementById('preview') ,
         continous: false, 
         mirror: false,
         backgroundScan: false, 
      }
   );
   
   console.log(scanner); 
   
   scanner.addListener('scan', function (content) {
     console.log(content);
     $scope.scannerOn = false; 
     $scope.destinationAddress = content; 
     scanner.stop(); 
   });

   function openScanner(){ 
      if (!$scope.scannerOn){
         Instascan.Camera.getCameras().then(function (cameras) {
            console.log(cameras);
            if (cameras.length > 0) {
               scanner.start(cameras[cameras.length-1]); 
               $scope.scannerOn = true; 
            } else {
               console.error('No cameras found.');
            }
         }).catch(function (e) {
           console.error(e);
         });
      } else { 
         scanner.stop().then(function(){
            $scope.scannerOn = false;
         })
      }
   }

}