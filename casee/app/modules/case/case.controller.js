/**
 * Created by sajarora on 9/9/16.
 */
(function(){
    'use strict';

    angular.module('app').controller('CaseCtrl', CaseCtrl);

    function CaseCtrl($log, electron, $state, $scope, caseData, assetService){
        var vm = this;
        vm.case = caseData;
        vm.editCase = EditCase;
        vm.assets = assetService.assets;
        vm.list = assetService.list;
        vm.sync = Sync;
        vm.tabs = Tabs();


        $scope.selectedTab = {index: 0, doNotSwitch: true};

        Activate();

        function Activate(){
            SelectTabBasedOnState();
            $scope.$watch('selectedTab.index', SeletedTabWatcher);
        }

        function SelectTabBasedOnState(){
            angular.forEach(vm.tabs, function (item, index) {
                if ($state.current.name.startsWith(item.link))
                    $scope.selectedTab.index = index;
            });
        }

        function SeletedTabWatcher(current, old) {
            if (!$scope.selectedTab.doNotSwitch) {
                $state.go(vm.tabs[current].link);
            } else {
                $scope.selectedTab.doNotSwitch = false; // reset the do not switch
            }
        }

        function Tabs(){
            return [
                {
                    title: 'Explorer',
                    icon: 'compass',
                    link: 'sidebar.case.explorer'
                },
                {
                    title: 'Visualizer',
                    icon: 'sitemap',
                    link: 'sidebar.case.visualizer'
                },
                {
                    title: 'Extensions',
                    icon: 'gear',
                    link: 'sidebar.case.extensions'
                }
            ];
        }

        function Sync(){
            return assetService.sync(vm.case.path);
        }

        function EditCase($index){
            caseService.edit($index);
        }
    }
})();