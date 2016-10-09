/**
 * Project: ProjectHT
 * Creator: sajarora
 * saj.arora24@gmail.com
 * File: navbar.controller.js: 10/8/16.
 */

(function(){
  'use strict';

  angular.module('app').controller('NavbarCtrl', NavbarCtrl);


  function NavbarCtrl($mdSidenav){
    var vm = this;
    vm.toggleSidenav = ToggleSidenav;


    ///functions
    function ToggleSidenav(menuId){
      $mdSidenav(menuId).toggle();
    }

  }
})();
