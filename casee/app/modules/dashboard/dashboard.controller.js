/**
 * Created by sajarora on 9/9/16.
 */
(function(){
    'use strict';

    angular.module('app').controller('DashboardCtrl', DashboardCtrl);

    function DashboardCtrl($log, $state, electron, caseService, Restangular){
        var vm = this;
        vm.editCase = EditCase;
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
            $state.go('sidebar.case.explorer', {key: item.key});
        }

        function EditCase($index){
            caseService.edit($index);
        }
    }
})();
