/**
 * Project: ProjectHT
 * Creator: sajarora
 * saj.arora24@gmail.com
 * File: sidebar.controller.js: 10/8/16.
 */

(function(){
  'use strict';

  angular.module('app').controller('CaseSidebarCtrl', SidebarCtrl);

  function SidebarCtrl($log, $scope, $state, caseData, assetService){
    var vm = this;
    vm.case = caseData;
    vm.dragEnabled = false;
    $scope.assets = assetService.assets.items;
    // vm.list = caseService.list;
    // vm.selectCase = SelectCase;

    Activate();

    ///functions
    function Activate(){
    }

    $scope.remove = function (scope) {
      scope.remove();
    };

    $scope.toggle = function (scope) {
      scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
      var a = $scope.assets.pop();
      $scope.assets.splice(0, 0, a);
    };

    $scope.newSubItem = function (scope) {
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
        nodes: []
      });
    };

    $scope.collapseAll = function () {
      $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
      $scope.$broadcast('angular-ui-tree:expand-all');
    };

    function SelectCase(item){
      $state.go('sidebar.case', {key: item.key});
    }
  }

})();
