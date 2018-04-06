'use strict';

angular
.module('ethWalletInformation')
.component('viewTransactions',{
   templateUrl: 'eth-wallet/view-transactions.template.html', 
   controller: viewTransactions
})

viewTransactions.$inject = ['$scope', 'blockExplorer', 'currentWallet','rates', 'viewTxDetails']; 

function viewTransactions($scope,blockExplorer,currentWallet,rates, viewTxDetails){

   $scope.wallet = currentWallet.getCurrentWallet(); 
   $scope.viewTx = viewTx; 
   $scope.midEllipsis = midEllipsis; 

   blockExplorer.getTransactions('0x'+$scope.wallet.address)
   .then(function(res){

      updatePendingTxs(res); 
      $scope.transactions = $scope.wallet.pendingTxs.concat(res); 
      console.log($scope.transactions); 
   
   })

   function viewTx(tx){
      console.log(tx);
      viewTxDetails(tx); 
   }

   function midEllipsis(address){
      return address.substr(0,6) + '...' + address.substr(address.length-6)
   }

   function updatePendingTxs(txs){
      
      var notPending = []; 

      angular.forEach($scope.wallet.pendingTxs,function(pendingTx,index){
         if (txs.find(x => x.hash == pendingTx.hash)){
            notPending.push(index); 
         }
      })

      for (var i=(notPending.length-1);i>=0;i--){
         $scope.wallet.pendingTxs.splice(i,1)
      }

   }

}