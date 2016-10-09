/**
 * Created by Saj Arora on 10/9/2016.
 */

(function(){
    angular.module('app').factory('caseService', CaseService);

    function CaseService($log, $mdDialog, $mdMedia, backendService){
        var factory = {};
        var name = 'case';
        factory.years = backendService.reset(name);
        factory.create = CreateCase;
        factory.edit = EditCase;
        factory.get = GetCase;
        factory.list = ListCases;
        factory.name = name;
        factory.reset = ResetCases;
        return factory;

        /// functions
        function CreateCase(data){
            // return wwtdBackend.create(factory.name, classYear);
        }

        function EditCase($index){
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
                            return factory.cases.items[$index];
                        else {
                            return {}
                        }
                    }
                }
            });
            promise.then(function (data) {
                if ($index == -1) {
                    factory.cases.items.unshift(data);
                }
            });
            return promise;
        }
        function GetCase(url){
            // return wwtdBackend.get(factory.name, url);
        }

        function ListCases(options, cursor){
            /**
             * Options: dictionary (!null = reset store)
             *  start: Start datetime of Channels listed will be >= start
             *  end: End datetime of Channels listed will be <= end
             *  class_year: integer
             * Cursor: datastore Cursor
             */
            // return wwtdBackend.list(factory.name, options, cursor).then(function(){
            //     angular.forEach(factory.years.items, function(year){
            //         wwtdBackend.restangular.restangularizeCollection(year, year.terms.items, 'terms', {fromServer: true});
            //     });
            //     $log.debug(factory.years);
            // });
        }

        function ResetCases(options){
            factory.cases = backendService.reset(factory.name, options);
            return factory.cases;
        }
    }
})();