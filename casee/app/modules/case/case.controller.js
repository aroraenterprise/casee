/**
 * Created by sajarora on 9/9/16.
 */
(function(){
    'use strict';

    angular.module('app').controller('CaseCtrl', CaseCtrl);

    function CaseCtrl($log, electron, caseData, assetService){
        var vm = this;
        vm.case = caseData;
        vm.editCase = EditCase;
        vm.assets = assetService.assets;
        vm.list = assetService.list;
        vm.sync = Sync;

        Activate();

        function Activate(){

        }

        function Sync(){
            return assetService.sync(vm.case.path);
        }

        function EditCase($index){
            caseService.edit($index);
        }
    }
})();