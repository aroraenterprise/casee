/**
 * Project: ProjectHT
 * Creator: sajarora
 * saj.arora24@gmail.com
 * File: sidebar.controller.js: 10/8/16.
 */

(function(){
  'use strict';

  angular.module('app').controller('SidebarCtrl', SidebarCtrl);

  function SidebarCtrl($log, $http){
    var vm = this;

    vm.cases = [];

    Activate();


    ///functions
    function Activate(){
      GenerateCases();
    }

    function GenerateCases(){
      $http.get('data/cases.json').success(function(data){
        vm.cases = data;
      });
    }
  }

})();
