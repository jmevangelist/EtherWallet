'use strict';

angular
.module('ethWallet')
.service('currentWallet',['$q','Wallet','showPinInterface',
   function ($q,Wallet,showPinInterface) {
   
      var currentWallet = undefined; 

      this.getCurrentWallet = function(){
         return currentWallet; 
      } 

      this.initializeWallet = initializeWallet;
      this.isWalletInLocalStorage = isWalletInLocalStorage; 
      this.recoverWalletFromLocalStorage = recoverWalletFromLocalStorage; 

      function initializeWallet(params){
         currentWallet = new Wallet(); 
         return currentWallet.create(params); 
      }

      function isWalletInLocalStorage(){
         if ( localStorage['keystore'] && localStorage['pendingTxs'] ){
            return true 
         } else {
            return false 
         }
      }

      function recoverWalletFromLocalStorage(){
         currentWallet = new Wallet(); 
         
         return showPinInterface('check',recover).then(function(res){
            return res; 
         })
         
         function recover(password){
            return currentWallet.recoverFromLocalStorage(password).then(function(res){
               return res  
            },function(e){
               console.log(e); 
            })
         }
      }

      document.addEventListener("pause", onPause, false);
      document.addEventListener("resume", onResume, false); 

      function onPause() {
          // Handle the pause event
         console.log('App put on backround');
         if (currentWallet){
            currentWallet.saveToLocalStorage(); 
            currentWallet = undefined;  
         }
      }

      function onResume(){
         console.log('App resumed.')
         if (isWalletInLocalStorage()){
            recoverWalletFromLocalStorage() 
         }
      }

}])


