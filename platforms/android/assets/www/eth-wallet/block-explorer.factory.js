
'use strict';

angular
.module('ethWallet')
.factory('blockExplorer', blockExplorer)

blockExplorer.$inject = ['$http','$httpParamSerializer']; 


function blockExplorer($http,$httpParamSerializer){

   var apikey = "T738CAM1RAZDS8XT8YYE1KJIZH7CCGKQKR";
   var network = "https://ropsten.etherscan.io/"

   return {
      getEthBalance: getEthBalance,
      getTransactions: getTransactions,
      sendRawTransaction: sendRawTransaction, 
      gasPrice : gasPrice,
      estimateGasAndGasPrice: estimateGasAndGasPrice,
      getTransactionCount: getTransactionCount, 
   }


   function getEthBalance(address){
      
      var params = $httpParamSerializer(
         {  module: 'account', 
            action: 'balance', 
            address: address, 
            apikey: apikey
         });

      var url = network + 'api?' + params; 

      return $http.get(url).then(function(res){
         console.log(res); 
         var balance 

         try {
            balance = res.data.result 
            balance = ( balance / 1000000000000000000 );
         } catch (e){

         }

         return balance 
      })

   }

   function getTransactions(address){

      var params = $httpParamSerializer(
         {  module: 'account', 
            action: 'txlist', 
            address: address, 
            apikey: apikey
         });

      var url = network + 'api?' + params; 

      return $http.get(url).then(function(res){
         return res.data.result; 
      })

   }

   function getTransactionCount(address){

      var params = $httpParamSerializer({
         module: 'proxy',
         action: 'eth_getTransactionCount', 
         address: address, 
         tag: 'latest',
         apikey: apikey
      }); 

      var url = network + 'api?' + params; 

      return $http.get(url).then(function(res){
         console.log(res)
         return res.data.result 
      })
   }

   function sendRawTransaction(hex){
      var params = $httpParamSerializer(
         {  module : 'proxy',
            action : 'eth_sendRawTransaction',
            apikey : apikey,
            hex : hex
         })

      var url = network + 'api?' + params;

      return $http.post(url).then(function(res){
         console.log('sendRawTransaction res:',res); 
         return res.data.result 
      })
   }

   function gasPrice(){
      
      var params = $httpParamSerializer({
         module : 'proxy',
         action : 'eth_gasPrice',
         apikey : apikey 
      })

      var url = network + 'api?' + params;

      return $http.post(url).then(function(res){
         console.log(res); 
         return res.data.result; 
      })
   }

   function estimateGasAndGasPrice(){
      return gasPrice()
         .then(estimateGas)
   }   

   function estimateGas(gasPrice){

      var params = $httpParamSerializer(
         {  module : 'proxy',
            action : 'eth_estimateGas',
            to: '0x3590e39cEC40E56E9cEDCB197EC22d07C03A1cEA', 
            value: '0xf22',
            gasPrice: gasPrice,
            gas: '0xffffff', 
            apikey: apikey
         })

      var url = network + 'api?' + params;

      return $http.post(url).then(function(res){
         console.log(res); 
         return { gas: res.data.result, gasPrice: gasPrice } 
      })

   }

}