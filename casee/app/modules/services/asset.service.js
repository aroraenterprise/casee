/**
 * Created by Saj Arora on 10/9/2016.
 */


(function(){
    angular.module('app').factory('assetService', AssetService);

    function AssetService($log, $q, $mdDialog, $mdMedia, backendService){
        var factory = {};
        var name = 'asset';
        var id = 0;
        factory.case = null;
        factory.assets = backendService.reset(name);
        factory.files = [];
        factory.links = [];
        factory.create = CreateAsset;
        factory.edit = EditAsset;
        factory.get = GetAsset;
        factory.list = ListAssets;
        factory.model = name;
        factory.name = name;
        factory.reset = ResetAssets;
        factory.sync = Sync;
        return factory;

        /// functions
        function CreateAsset(data){
            return backendService.create(factory.name, data);
        }

        function EditAsset($index){
            var promise = $mdDialog.show({
                controller: 'CaseEditCtrl',
                controllerAs: 'dialog',
                templateUrl: 'modules/case/case-edit.dialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: false,
                fullscreen: !$mdMedia('gt-xs'),
                resolve: {
                    data: function () {
                        if ($index > -1)
                            return factory.assets.items[$index];
                        else {
                            return {}
                        }
                    }
                }
            });
            promise.then(function (data) {
                if ($index == -1) {
                    factory.assets.items.unshift(data);
                }
            });
            return promise;
        }
        function GetAsset(key){
            return backendService.get(factory.name, key);
        }

        function ListAssets(options, cursor){
            /**
             * Options: dictionary (!null = reset store)
             *  start: Start datetime of Channels listed will be >= start
             *  end: End datetime of Channels listed will be <= end
             *  class_year: integer
             * Cursor: datastore Cursor
             */
            return backendService.list(factory.model, options, cursor);
        }

        function ResetAssets(caseData, options){
            var model = 'case/' + caseData.key + '/' + factory.name;
            if (factory.model !== model){
                factory.model = model;
                factory.assets = backendService.reset(factory.model, options);
            }
            return factory.assets;
        }

        function WalkDirectory(srcPath){
            var files = GetDirectoryFilesSync(srcPath);
            var result = [];
            angular.forEach(files, function (file, index) {
                var stats = GetStats(path.join(srcPath, file));
                var newAsset = {title: file, dirPath: srcPath, stat: stats, ext: path.extname(file)};
                if (stats.isDirectory()) { // a directory
                    newAsset.nodes = WalkDirectory(path.join(srcPath, file));
                }
                result.push(newAsset);
            });
            return result;
        }

        function ParseFiles(directory, count){
            angular.forEach(directory && directory.nodes ? directory.nodes : factory.assets.items, function(asset){
                if (!asset.stat.isDirectory()){
                    asset.path = asset.dirPath + '\\' + asset.title;
                    asset.group = count;
                    asset.dir = false;
                    factory.files.push(asset);
                } else {
                    asset.path = asset.dirPath + '\\' + asset.title;
                    asset.dir = true;
                    asset.group = count++;
                    factory.files.push(asset);
                    ParseFiles(asset, count);
                }
                if (count !== 0) {
                    var link = {source: id, target: count, value: 8};
                    factory.links.push(link);
                }
                id++;
            });
        }

        function Sync(srcPath){
            var _deferred = $q.defer();
            var callable = function(){
                factory.assets.items = WalkDirectory(srcPath);
                ParseFiles(factory.assets.items, 0);
                $log.debug(factory.links);
                _deferred.resolve();
            };
            callable();
            return _deferred.promise;
        }
    }

    var fs = require('fs'),
        path = require('path');

    function GetDirectoryFilesSync(srcpath) {
        if (srcpath.indexOf('~') == 0) {
            srcpath = srcpath.replace('~', process.env['HOME']);
        }

        srcpath = path.normalize(srcpath);
        return fs.readdirSync(srcpath);
    }

    function GetStats(path){
        return fs.statSync(path);
    }

    var md5File = require('md5-file');

    function hashFile(file, callback){
        md5File(file, callback);
    }

})();