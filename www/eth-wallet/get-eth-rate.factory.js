'use strict';

angular
.module('ethWallet')
.factory('getETHRate', getETHRate)
.service('rates',rates)

getETHRate.$inject = ['$q','$http'];

function getETHRate($q,$http){
   return {
      all: getRate, 
      usd: getETHinUSD,
      php: getETHinPHP
   }

   function getRate(){
      var url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD,PHP";
      return $http.get(url).then(function(rate){
         console.log(rate);
         return rate.data
      })
   }; 

   function getETHinUSD(){
      return getRate().then(function(rate){
         return rate.USD 
      })
   }

   function getETHinPHP(){
      return getRate().then(function(rate){
         return rate.PHP 
      })
   }

}

rates.$inject = ['getETHRate']; 

function rates(getETHRate){

   this.rates = {
      ETHinPHP : 0,
      ETHinUSD : 0, 
      dateOfLastRefresh : undefined
   }

   var interval = 5000; 
   
   this.start = function(){

      var self = this;

      recur(); 

      function recur(){ 
         setTimeout(function() {
            getRates()
            .then(recur)
         }, interval);
      }

      function getRates(){
         return getETHRate.all()
            .then(function(rates){
               console.log(rates); 
               self.rates.dateOfLastRefresh = new Date(); 
               self.rates.ETHinPHP = rates.PHP; 
               self.rates.ETHinUSD = rates.USD; 
            })
      }

   }

}