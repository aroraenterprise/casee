/**
 * Project: ProjectHT
 * Creator: sajarora
 * saj.arora24@gmail.com
 * File: sidebar.controller.js: 10/8/16.
 */

(function(){
  'use strict';

  angular.module('app').controller('SidebarCtrl', SidebarCtrl);

  function SidebarCtrl($log, $state, $mdSidenav){
    var vm = this;
    vm.goDashboard = GoDashboard;

    ///functions
    function GoDashboard(){
      $state.go('dashboard');
      $mdSidenav('left').close();
    }
  }

})();
