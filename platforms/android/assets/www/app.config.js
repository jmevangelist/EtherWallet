'use strict';

angular
   .module('nixEtherWallet')
   .config(['$locationProvider','$routeProvider',
      function config($locationProvider, $routeProvider){

         $locationProvider.hashPrefix('!');

         $routeProvider.
            when('/eth-wallet-information',{
               template: '<eth-wallet-information flex></eth-wallet-information>'
            }).
            when('/eth-wallet-setup',{
               template: '<eth-wallet-setup flex></eth-wallet-setup>'
            }).
            when('/send-coins',{
               template: '<send-coins flex></send-coins>'
            }).
            when('/view-transactions',{
               template: '<view-transactions flex></view-transactions>'
            })
            //.otherwise('/eth-wallet-setup');
         
         }
      ])
   .config(['isProduction',function(isProduction){

      if (isProduction){
         try {
            if (typeof(window.console) != "undefined") {

               window.console = {};
               window.console.log = function () {
               };
               window.console.info = function () {
               };
               window.console.warn = function () {
               };
               window.console.error = function () {
               };
            }

            if (typeof(alert) !== "undefined") {
               alert = function () {
               }
            }

         } catch (ex) {

         }
      }

   }])
   .config(['$mdIconProvider',function($mdIconProvider){

      $mdIconProvider.icon('qr','css/res/qr.svg',29); 
      $mdIconProvider.icon('qr_white','css/res/qr_white.svg',29);

   }])
   .run(function($rootScope, $location) {
      $rootScope.$on( "$locationChangeStart", function(event, next, current) { 
         


      });
   });