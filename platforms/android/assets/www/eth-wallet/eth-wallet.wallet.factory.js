'use strict';

angular
.module('ethWallet')
.factory('Wallet',['$q',function($q){

   var Wallet = function(params){

      var self = this;

      console.log(params); 

      this.keystore = undefined;
      this.address = undefined; 
      //this.seed = params.seed || undefined;
      //this.password = params.pin || undefined; 
      this.pendingTxs = [];  
      
      var _pwDerivedKey;
      self.setpwDerivedKey = function(key){ _pwDerivedKey = key; }
      self.getpwDerivedKey = function(){ return _pwDerivedKey; }

   }



   Wallet.prototype.create = function(params){

      var q = $q.defer(); 

      var self = this; 

      var salt = lightwallet.keystore.generateSalt(); 
      var options = {
         password: params.password,
         seedPhrase: params.seed,
         entropy: new Date(),
         salt: salt 
      }

      console.log(options)

      lightwallet.keystore.createVault(options, function(err,vault){
         if (!err){
            self.keystore = vault; 
            self.keystore.keyFromPassword(params.password,function(err,pwDerivedKey){
               if (!err){   
                  self.setpwDerivedKey(pwDerivedKey); //temporary
                  self.keystore.generateNewAddress(pwDerivedKey);
                  
                  self.address = self.keystore.getAddresses()[0];   
                  q.resolve(true); 
               } else {
                  q.reject(err);
               }
            })
         } else {
            q.reject(err); 
         }
      })

      return q.promise 
   }

   Wallet.prototype.isPinValid = function(pin){

      var self = this; 

      var q = $q.defer();

      this.keystore.keyFromPassword(pin,function(err, pwDerivedKey){
         
         if (!err){
            q.resolve(self.keystore.isDerivedKeyCorrect(pwDerivedKey))
         } else {
            q.reject(err); 
         }   
      })


      return q.promise; 

   }

   Wallet.prototype.sign = function(tx){
      var self = this; 

      var signedValueTx = lightwallet.signing.signTx(
         self.keystore, 
         self.getpwDerivedKey(), 
         tx, 
         self.address 
      )

      return signedValueTx 

   }

   Wallet.prototype.addPendingTransaction = function(tx){
      var self = this; 

      //check if hash is already in pending txs 
      var duplicate = self.pendingTxs.map(x => x.hash).includes(tx.hash); 

      if (!duplicate){
         self.pendingTxs.push({
            hash: tx.hash,
            to: tx.address, 
            value: tx.value*1000000000000000000,
            timeStamp: Math.floor(Date.now()/1000).toString(),
            confirmations: 0, 
            from: '0x'+self.address
         })
      }

   }

   Wallet.prototype.updatePendingTxsLocalStorage = function(){
      var jsonPendingTxs = JSON.stringify(this.pendingTxs)
      localStorage.setItem('pendingTxs',jsonPendingTxs);
      console.log('pendingTxs saved on localstorage', localStorage['pendingTxs'])
   }

   Wallet.prototype.saveKeystoreInLocalStorage = function(){
      var serializedKeystore = this.keystore.serialize(); 

      console.log(serializedKeystore); 
      localStorage.setItem('keystore',serializedKeystore); 
      console.log('keystore saved on localstorage',localStorage['keystore']);
   }

   Wallet.prototype.saveToLocalStorage = function(){
      this.saveKeystoreInLocalStorage(); 
      this.updatePendingTxsLocalStorage(); 
   }

   Wallet.prototype.recoverFromLocalStorage = function(password){

      this.keystore = lightwallet.keystore.deserialize(localStorage['keystore']);
      this.pendingTxs = JSON.parse(localStorage['pendingTxs']);

      var self = this; 
      var q = $q.defer(); 
      
      this.keystore.keyFromPassword(password,function(err,pwDerivedKey){
         if (!err){   
            self.password = password; 
            self.setpwDerivedKey(pwDerivedKey); //temporary
            self.keystore.generateNewAddress(pwDerivedKey);
            self.address = self.keystore.getAddresses()[0];   
            q.resolve(true) 
         } else {
            console.log(err); 
            q.resolve(false);
         }
      })

      return q.promise 

   }


   return Wallet 

}])