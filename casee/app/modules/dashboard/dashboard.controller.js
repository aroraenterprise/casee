/**
 * Created by sajarora on 9/9/16.
 */
(function(){
    'use strict';

    angular.module('app').controller('DashboardCtrl', DashboardCtrl);

    function DashboardCtrl($log, electron, caseService, Restangular){
        var vm = this;
        vm.editCase = EditCase;

        function EditCase($index){
            caseService.edit($index);
        }
    }
})();
