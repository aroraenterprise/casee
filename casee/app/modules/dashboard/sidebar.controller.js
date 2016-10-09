/**
 * Project: ProjectHT
 * Creator: sajarora
 * saj.arora24@gmail.com
 * File: sidebar.controller.js: 10/8/16.
 */

(function(){
  'use strict';

  angular.module('app').controller('DashboardSidebarCtrl', SidebarCtrl);

  function SidebarCtrl($log, $state, $mdSidenav, caseService){
    var vm = this;
    vm.cases = caseService.cases;
    vm.list = caseService.list;
    vm.selectCase = SelectCase;

    Activate();

    ///functions
    function Activate(){
      if (!vm.cases.initialized){
        vm.list().then($log.debug);
      }
    }

    function SelectCase(item){
      $state.go('sidebar.case', {key: item.key});
      $mdSidenav('left').close();
    }
  }

})();
