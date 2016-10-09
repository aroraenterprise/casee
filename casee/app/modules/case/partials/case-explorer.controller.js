/**
 * Created by sajarora on 9/9/16.
 */
(function(){
    'use strict';

    angular.module('app').controller('CaseExplorerCtrl', CaseCtrl);

    function CaseCtrl($log, electron, caseData, $filter, assetService){
        var vm = this;
        vm.case = caseData;
        vm.editCase = EditCase;
        vm.assets = assetService.assets.items;
        vm.list = assetService.list;
        vm.querySearch = QuerySearch;
        vm.files = [];
        vm.sync = Sync;
        vm.tabs = Tabs();
        vm.isImage = function(item){
            return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(item.title)
        };
        vm.openFile = function(link){
            // Open a local file in the default app
            electron.shell.openItem(link);
        };
        vm.filters = [
            {
               name: 'Creation Time'
            },
            {
                name: 'Modified Time'
            },
            {
                name: 'Location Tags'
            }
        ];

        vm.fileTypes = [
            {
                name: 'png',
                category: 'images'
            },
            {
                name: 'gif',
                category: 'images'
            },
            {
                name: 'jpg',
                category: 'images'
            },
            {
                name: 'jpeg',
                category: 'images'
            },
            {
                name: 'bmp',
                category: 'images'
            },
            {
                name: 'tiff',
                category: 'images'
            },
            {
                name: 'pdf',
                category: 'doc'
            },
            {
                name: 'docx',
                category: 'doc'
            }

        ]
        Activate();

        function Activate(){
            ParseFiles();
        }

        function ParseFiles(directory){
            angular.forEach(directory && directory.nodes ? directory.nodes : vm.assets, function(asset){
                if (!asset.stat.isDirectory()){
                    asset.path = asset.dirPath + '\\' + asset.title;
                    vm.files.push(asset);
                } else {
                    ParseFiles(asset);
                }
            });
        }

        function QuerySearch(query){
            $log.debug($filter('filter')(vm.files, query));
            return $filter('filter')(vm.files, query);
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
                    icon: 'glasses',
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